import { useState, useCallback, useEffect } from 'react';
import { flowAPI } from '../services/api';

// Internal connection test function
const testConnection = async () => {
  try {
    console.log('🔍 Testing server connection...');
    const response = await flowAPI.getFlows();
    console.log('✅ Server connection successful');
    return true;
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
    return false;
  }
};

export const useFlowDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  // Test connection on hook initialization
  useEffect(() => {
    const checkConnection = async () => {
      console.log('🔍 Checking database connection...');
      setConnectionStatus('connecting');
      
      try {
        const isConnected = await testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        
        if (isConnected) {
          console.log('✅ Database connection established');
        } else {
          console.log('❌ Database connection failed');
        }
      } catch (error) {
        console.error('❌ Connection test error:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    console.log('🧹 Clearing error state');
    setError(null);
  }, []);

  // Save flow to database
  const saveFlowToDatabase = useCallback(async (flowData, botName, botId = null) => {
    console.log('💾 Starting database save operation:', {
      botName,
      botId,
      nodeCount: flowData.nodes.length,
      edgeCount: flowData.edges.length,
      isUpdate: !!botId
    });

    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        name: botName,
        description: `Chatbot flow with ${flowData.nodes.length} nodes`,
        flowData: flowData,
        status: 'draft',
        nodeCount: flowData.nodes.length,
        lastModified: new Date().toISOString()
      };

      console.log('📦 Prepared payload:', {
        name: payload.name,
        description: payload.description,
        status: payload.status,
        nodeCount: payload.nodeCount,
        flowDataSize: JSON.stringify(payload.flowData).length,
        flowData: { nodes: payload.flowData.nodes, 
        edges: payload.flowData.edges}
      });

      let result;
      if (botId) {
        console.log('🔄 Updating existing flow...');
        result = await flowAPI.updateFlow(botId, payload);
      } else {
        console.log('➕ Creating new flow...');
        result = await flowAPI.createFlow(payload);
      }

      console.log('✅ Database save completed:', {
        id: result.id,
        name: result.name,
        status: result.status,
        operation: botId ? 'update' : 'create'
      });

      setConnectionStatus('connected');
      return result;
    } catch (err) {
      console.error('❌ Database save failed:', {
        error: err.message,
        botName,
        botId,
        timestamp: new Date().toISOString()
      });
      
      setError(err.message);
      setConnectionStatus('disconnected');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 Database save operation completed');
    }
  }, []);

  // Load flow from database
  const loadFlowFromDatabase = useCallback(async (flowId) => {
    console.log('📖 Starting database load operation:', { flowId });
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await flowAPI.getFlow(flowId);
      
      console.log('✅ Database load completed:', {
        id: result.id,
        name: result.name,
        nodeCount: result.nodeCount,
        status: result.status
      });
      
      setConnectionStatus('connected');
      return result;
    } catch (err) {
      console.error('❌ Database load failed:', {
        error: err.message,
        flowId,
        timestamp: new Date().toISOString()
      });
      
      setError(err.message);
      setConnectionStatus('disconnected');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 Database load operation completed');
    }
  }, []);

  // Load all flows from database
  const loadAllFlowsFromDatabase = useCallback(async () => {
    console.log('📚 Starting load all flows operation...');
    
    setLoading(true);
    setError(null);
    
    try {
      const flows = await flowAPI.getFlows();
      
      console.log('✅ Load all flows completed:', 
         flows
      );
      
      setConnectionStatus('connected');
      return flows;
    } catch (err) {
      console.error('❌ Load all flows failed:', {
        error: err.message,
        timestamp: new Date().toISOString()
      });
      
      setError(err.message);
      setConnectionStatus('disconnected');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 Load all flows operation completed');
    }
  }, []);

  // Delete flow from database
  const deleteFlowFromDatabase = useCallback(async (flowId) => {
    console.log('🗑️ Starting database delete operation:', { flowId });
    
    setLoading(true);
    setError(null);
    
    try {
      await flowAPI.deleteFlow(flowId);
      
      console.log('✅ Database delete completed:', { flowId });
      
      setConnectionStatus('connected');
      return true;
    } catch (err) {
      console.error('❌ Database delete failed:', {
        error: err.message,
        flowId,
        timestamp: new Date().toISOString()
      });
      
      setError(err.message);
      setConnectionStatus('disconnected');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 Database delete operation completed');
    }
  }, []);

  // Publish flow
  const publishFlow = useCallback(async (flowId) => {
    console.log('🚀 Starting publish operation:', { flowId });
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await flowAPI.publishFlow(flowId);
      
      console.log('✅ Publish completed:', {
        id: flowId,
        status: result.status
      });
      
      setConnectionStatus('connected');
      return result;
    } catch (err) {
      console.error('❌ Publish failed:', {
        error: err.message,
        flowId,
        timestamp: new Date().toISOString()
      });
      
      setError(err.message);
      setConnectionStatus('disconnected');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 Publish operation completed');
    }
  }, []);

  // Unpublish flow
  const unpublishFlow = useCallback(async (flowId) => {
    console.log('⏸️ Starting unpublish operation:', { flowId });
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await flowAPI.unpublishFlow(flowId);
      
      console.log('✅ Unpublish completed:', {
        id: flowId,
        status: result.status
      });
      
      setConnectionStatus('connected');
      return result;
    } catch (err) {
      console.error('❌ Unpublish failed:', {
        error: err.message,
        flowId,
        timestamp: new Date().toISOString()
      });
      
      setError(err.message);
      setConnectionStatus('disconnected');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 Unpublish operation completed');
    }
  }, []);

  return {
    loading,
    error,
    connectionStatus,
    clearError,
    saveFlowToDatabase,
    loadFlowFromDatabase,
    loadAllFlowsFromDatabase,
    deleteFlowFromDatabase,
    publishFlow,
    unpublishFlow
  };
};