import { useState, useCallback, useEffect, useRef } from 'react';
import { flowAPI } from '../services/api';

export const useFlowEditor = (currentBotId) => {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });
  const [editingNode, setEditingNode] = useState(null);
  const lastBotIdRef = useRef(null);

  // Load flow data when bot ID changes
  useEffect(() => {
    console.log('🔄 Bot ID changed:', { 
      from: lastBotIdRef.current, 
      to: currentBotId,
      isNewBot: currentBotId === null,
      isSwitchingBots: lastBotIdRef.current !== currentBotId
    });
    
    // Always update the ref to track changes
    const previousBotId = lastBotIdRef.current;
    lastBotIdRef.current = currentBotId;
    
    if (currentBotId === null) {
      // New bot - always start completely fresh
      console.log('🆕 New bot detected - clearing all flow data');
      setFlowData({ nodes: [], edges: [] });
    } else if (currentBotId !== previousBotId) {
      // Switching to a different existing bot
      console.log('🔄 Switching to existing bot:', currentBotId);
      loadFlowData(currentBotId);
    }
  }, [currentBotId]);

  const loadFlowData = async (botId) => {
    try {
      console.log('📖 Loading flow data for bot:', botId);
      
      // Try to load from API first
      const flowFromAPI = await flowAPI.getFlow(botId);
      console.log('✅ Flow loaded from API:', flowFromAPI);
      
      if (flowFromAPI && flowFromAPI.flowData) {
        setFlowData(flowFromAPI.flowData);
        
        // Also save to localStorage as backup
        const storageKey = `chatbot-flow-${botId}`;
        localStorage.setItem(storageKey, JSON.stringify(flowFromAPI.flowData));
        
        // Save bot name if available
        if (flowFromAPI.name) {
          localStorage.setItem(`chatbot-name-${botId}`, flowFromAPI.name);
        }
        
        console.log('💾 Flow data cached locally');
        return;
      }
    } catch (error) {
      console.warn('⚠️ Failed to load from API, trying localStorage:', error.message);
    }
    
    // Fallback to localStorage
    const storageKey = `chatbot-flow-${botId}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Loaded flow data from localStorage:', {
          nodeCount: parsedData.nodes?.length || 0,
          edgeCount: parsedData.edges?.length || 0
        });
        setFlowData(parsedData);
      } catch (error) {
        console.error('❌ Error parsing saved flow data:', error);
        setFlowData({ nodes: [], edges: [] });
      }
    } else {
      console.log('📝 No saved data found for bot, starting with empty flow');
      setFlowData({ nodes: [], edges: [] });
    }
  };

  const handleFlowDataChange = useCallback((newFlowData) => {
    console.log('🔄 Flow data changed:', {
      nodeCount: newFlowData.nodes?.length || 0,
      edgeCount: newFlowData.edges?.length || 0,
      currentBotId,
      isNewBot: currentBotId === null
    });
    
    setFlowData(newFlowData);
    
    // Auto-save to localStorage for current session (only if we have a bot ID)
    if (currentBotId) {
      const storageKey = `chatbot-flow-${currentBotId}`;
      localStorage.setItem(storageKey, JSON.stringify(newFlowData));
      console.log('💾 Auto-saved to localStorage:', storageKey);
    } else {
      console.log('⏭️ Skipping auto-save for new bot (no ID yet)');
    }
  }, [currentBotId]);

  const handleNodeEdit = useCallback((nodeId, nodeData) => {
    console.log('✏️ Opening node editor:', { nodeId, nodeType: nodeData.type });
    setEditingNode({ id: nodeId, data: nodeData });
  }, []);

  const handleCloseEditor = useCallback(() => {
    console.log('❌ Closing node editor');
    setEditingNode(null);
  }, []);

  return {
    flowData,
    editingNode,
    handleFlowDataChange,
    handleNodeEdit,
    handleCloseEditor
  };
};