import { useState, useCallback, useEffect } from 'react';

export const useFlowEditor = (currentBotId) => {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });
  const [editingNode, setEditingNode] = useState(null);

  // Load flow data when bot ID changes
  useEffect(() => {
    console.log('🔄 Loading flow data for bot:', { currentBotId });
    
    if (currentBotId) {
      // Load existing bot data
      const storageKey = `chatbot-flow-${currentBotId}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('✅ Loaded existing flow data:', {
            nodeCount: parsedData.nodes?.length || 0,
            edgeCount: parsedData.edges?.length || 0
          });
          setFlowData(parsedData);
        } catch (error) {
          console.error('❌ Error parsing saved flow data:', error);
          setFlowData({ nodes: [], edges: [] });
        }
      } else {
        console.log('📝 No saved data found, starting with empty flow');
        setFlowData({ nodes: [], edges: [] });
      }
    } else {
      // New bot - start with empty flow
      console.log('🆕 New bot - starting with empty flow');
      setFlowData({ nodes: [], edges: [] });
    }
  }, [currentBotId]);

  const handleFlowDataChange = useCallback((newFlowData) => {
    console.log('🔄 Flow data changed:', {
      nodeCount: newFlowData.nodes?.length || 0,
      edgeCount: newFlowData.edges?.length || 0,
      currentBotId
    });
    
    setFlowData(newFlowData);
    
    // Auto-save to localStorage for current session
    if (currentBotId) {
      const storageKey = `chatbot-flow-${currentBotId}`;
      localStorage.setItem(storageKey, JSON.stringify(newFlowData));
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