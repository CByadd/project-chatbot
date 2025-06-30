import { useState, useCallback, useEffect } from 'react';
import { useFlowDatabase } from './useFlowDatabase';

export const useFlowEditor = (currentBotId) => {
  const [flowData, setFlowData] = useState({ nodes: [], edges: [] });
  const [editingNode, setEditingNode] = useState(null);
  
  const { loadFlowFromDatabase } = useFlowDatabase();


  const loadBotData = useCallback(async (botId) => {
    console.log('📖 Loading bot data for editor:', { botId });

    try {
      // Try to load from API first
      const apiFlow = await loadFlowFromDatabase(botId);

      if (apiFlow && apiFlow.flowData) {
        const parsedFlowData = typeof apiFlow.flowData === 'string'
          ? JSON.parse(apiFlow.flowData)
          : apiFlow.flowData;

        // Ensure we have valid flow data structure
        const validFlowData = {
          nodes: Array.isArray(parsedFlowData.nodes) ? parsedFlowData.nodes : [],
          edges: Array.isArray(parsedFlowData.edges) ? parsedFlowData.edges : []
        };

        setFlowData(validFlowData);
        console.log('✅ Bot data loaded from API for editor:', {
          nodeCount: validFlowData.nodes.length,
          edgeCount: validFlowData.edges.length
        });
      } else {
        throw new Error('No flow data in API response');
      }
    } catch (error) {
      console.warn('⚠️ API load failed, trying localStorage:', error.message);

      const storageKey = `chatbot-flow-${botId}`;
      const savedData = localStorage.getItem(storageKey);

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          
          // Ensure we have valid flow data structure
          const validFlowData = {
            nodes: Array.isArray(parsedData.nodes) ? parsedData.nodes : [],
            edges: Array.isArray(parsedData.edges) ? parsedData.edges : []
          };
          
          setFlowData(validFlowData);
          console.log('✅ Bot data loaded from localStorage for editor:', {
            nodeCount: validFlowData.nodes.length,
            edgeCount: validFlowData.edges.length
          });
        } catch (parseError) {
          console.error('❌ Error parsing localStorage data:', parseError);
          setFlowData({ nodes: [], edges: [] });
        }
      } else {
        console.log('ℹ️ No saved data found, starting with empty flow');
        setFlowData({ nodes: [], edges: [] });
      }
    }
  }, [loadFlowFromDatabase]);

  // Load flow data when bot ID changes
  useEffect(() => {
    if (currentBotId) {
      loadBotData(currentBotId);
    } else {
      // Reset for new bot with initial trigger node
      const initialFlowData = {
        nodes: [
          {
            id: '1',
            type: 'custom',
            position: { x: 400, y: 100 },
            data: {
              label: 'Welcome Trigger',
              type: 'trigger',
              description: 'Start Flow',
              trigger: 'hi,hello,start',
              text: '',
              messageType: 'trigger',
              nextNodeId: ''
            },
          }
        ],
        edges: []
      };
      setFlowData(initialFlowData);
    }
  }, [currentBotId]);



  const handleFlowDataChange = useCallback((newFlowData) => {
    // Validate flow data structure
    if (!newFlowData || typeof newFlowData !== 'object') {
      console.warn('⚠️ Invalid flow data received:', newFlowData);
      return;
    }

    const validFlowData = {
      nodes: Array.isArray(newFlowData.nodes) ? newFlowData.nodes : [],
      edges: Array.isArray(newFlowData.edges) ? newFlowData.edges : []
    };

    console.log('🔄 Flow data changed:', {
      nodeCount: validFlowData.nodes.length,
      edgeCount: validFlowData.edges.length,
      timestamp: new Date().toISOString()
    });

    setFlowData(validFlowData);
    
    // Save to localStorage for persistence
    const storageKey = currentBotId ? `chatbot-flow-${currentBotId}` : 'chatbot-flow';
    try {
      localStorage.setItem(storageKey, JSON.stringify(validFlowData));
      console.log('💾 Flow data saved to localStorage:', {
        key: storageKey,
        size: JSON.stringify(validFlowData).length
      });
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }, [currentBotId]);

  const handleNodeEdit = useCallback((nodeId, nodeData) => {
    console.log('✏️ Node edit requested:', {
      nodeId,
      nodeType: nodeData.type,
      timestamp: new Date().toISOString()
    });
    setEditingNode({ id: nodeId, data: nodeData });
  }, []);

  const handleCloseEditor = useCallback(() => {
    console.log('❌ Node editor closed');
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