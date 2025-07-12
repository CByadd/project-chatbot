import { useState, useCallback, useEffect, useRef } from 'react';
import { flowAPI } from '../services/api';

export const useFlowEditor = (currentBotId) => {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });
  const [editingNode, setEditingNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [botName, setBotName] = useState('');
  const lastBotIdRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  // Load flow data when bot ID changes
  useEffect(() => {
    console.log('🔄 Bot ID changed in useFlowEditor:', { 
      from: lastBotIdRef.current, 
      to: currentBotId,
      isNewBot: currentBotId === null,
      isSwitchingBots: lastBotIdRef.current !== currentBotId
    });
    
    // Clear any pending loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Always update the ref to track changes
    const previousBotId = lastBotIdRef.current;
    lastBotIdRef.current = currentBotId;
    
    if (currentBotId === null) {
      // New bot - always start completely fresh
      console.log('🆕 New bot detected - clearing all flow data');
      setFlowData({ nodes: [], edges: [] });
      setBotName('New Chatbot Flow');
      setIsLoading(false);
    } else if (currentBotId !== previousBotId) {
      // Switching to a different existing bot - load its specific data
      console.log('🔄 Switching to existing bot:', currentBotId);
      
      // Set loading state immediately
      setIsLoading(true);
      
      // Add a small delay to prevent rapid switching glitches
      loadingTimeoutRef.current = setTimeout(() => {
        loadFlowData(currentBotId);
      }, 100);
    }
  }, [currentBotId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const loadFlowData = async (botId) => {
    if (!botId) {
      console.log('❌ No bot ID provided to loadFlowData');
      setIsLoading(false);
      return;
    }

    console.log('📖 Loading flow data for specific bot:', botId);
    
    try {
      // Try to load from API first
      console.log('🌐 Attempting to load from API...');
      const flowFromAPI = await flowAPI.getFlow(botId);
      console.log('✅ Flow loaded from API:', {
        id: flowFromAPI.id,
        name: flowFromAPI.name,
        nodeCount: flowFromAPI.flowData?.nodes?.length || 0,
        edgeCount: flowFromAPI.flowData?.edges?.length || 0
      });
      
      if (flowFromAPI && flowFromAPI.flowData) {
        console.log('📊 Setting flow data from API');
        
        // Set bot name from API
        const displayName = flowFromAPI.botName || `Bot ${botId}`;
        setBotName(displayName);
        
        // Set flow data - ensure all nodes are loaded
        const completeFlowData = {
          nodes: flowFromAPI.flowData.nodes || [],
          edges: flowFromAPI.flowData.edges || []
        };
        setFlowData(completeFlowData);
        
        // Also save to localStorage as backup for this specific bot
        const storageKey = `chatbot-flow-${botId}`;
        localStorage.setItem(storageKey, JSON.stringify(completeFlowData));
        localStorage.setItem(`chatbot-name-${botId}`, displayName);
        
        console.log('💾 Flow data cached locally for bot:', botId, 'with', completeFlowData.nodes.length, 'nodes');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.warn('⚠️ Failed to load from API for bot', botId, ':', error.message);
    }
    
    // Fallback to localStorage for this specific bot
    console.log('💾 Falling back to localStorage for bot:', botId);
    const storageKey = `chatbot-flow-${botId}`;
    const savedData = localStorage.getItem(storageKey);
    const savedName = localStorage.getItem(`chatbot-name-${botId}`);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Loaded flow data from localStorage for bot', botId, ':', {
          nodeCount: parsedData.nodes?.length || 0,
          edgeCount: parsedData.edges?.length || 0
        });
        
        // Ensure all nodes are included
        const completeFlowData = {
          nodes: parsedData.nodes || [],
          edges: parsedData.edges || []
        };
        setFlowData(completeFlowData);
        
        // Set bot name
        const displayName = savedName || `Bot ${botId}`;
        setBotName(displayName);
        
      } catch (error) {
        console.error('❌ Error parsing saved flow data for bot', botId, ':', error);
        setFlowData({ nodes: [], edges: [] });
        setBotName(`Bot ${botId}`);
      }
    } else {
      console.log('📝 No saved data found for bot', botId, ', starting with empty flow');
      setFlowData({ nodes: [], edges: [] });
      setBotName(`Bot ${botId}`);
    }
    
    setIsLoading(false);
  };

  const handleFlowDataChange = useCallback((newFlowData) => {
    console.log('🔄 Flow data changed for bot', currentBotId, ':', {
      nodeCount: newFlowData.nodes?.length || 0,
      edgeCount: newFlowData.edges?.length || 0,
      isNewBot: currentBotId === null
    });
    
    // Ensure all nodes and edges are preserved
    const completeFlowData = {
      nodes: newFlowData.nodes || [],
      edges: newFlowData.edges || []
    };
    
    setFlowData(completeFlowData);
    
    // Auto-save to localStorage for current session (only if we have a bot ID)
    if (currentBotId) {
      const storageKey = `chatbot-flow-${currentBotId}`;
      localStorage.setItem(storageKey, JSON.stringify(completeFlowData));
      console.log('💾 Auto-saved to localStorage for bot:', currentBotId, 'with', completeFlowData.nodes.length, 'nodes');
    } else {
      console.log('⏭️ Skipping auto-save for new bot (no ID yet)');
    }
  }, [currentBotId]);

  const handleNodeEdit = useCallback((nodeId, nodeData) => {
    console.log('✏️ Opening node editor for bot', currentBotId, ':', { nodeId, nodeType: nodeData.type });
    setEditingNode({ id: nodeId, data: nodeData });
  }, [currentBotId]);

  const handleCloseEditor = useCallback(() => {
    console.log('❌ Closing node editor for bot:', currentBotId);
    setEditingNode(null);
  }, [currentBotId]);

  const updateBotName = useCallback((newName) => {
    setBotName(newName);
    if (currentBotId) {
      localStorage.setItem(`chatbot-name-${currentBotId}`, newName);
    }
  }, [currentBotId]);

  return {
    flowData,
    editingNode,
    isLoading,
    botName,
    handleFlowDataChange,
    handleNodeEdit,
    handleCloseEditor,
    updateBotName,
    loadFlowData // Expose this for manual reloading if needed
  };
};