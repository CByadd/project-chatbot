import { useState, useCallback } from 'react';
import { useFlowDatabase } from './useFlowDatabase';

export const useBotManagement = () => {
  const [currentView, setCurrentView] = useState('management');
  const [currentBotId, setCurrentBotId] = useState(null);
  
  const { loadFlowFromDatabase } = useFlowDatabase();

  const handleCreateNewBot = useCallback(() => {
    console.log('➕ Creating new bot...');
    
    setCurrentBotId(null);
    setCurrentView('editor');

    console.log('✅ New bot created');
  }, []);

  const handleEditBot = useCallback(async (botId) => {
    console.log('✏️ Editing bot:', { botId });

    try {
      // Try to load from API first
      const apiFlow = await loadFlowFromDatabase(botId);

      if (apiFlow && apiFlow.flowData) {
        console.log('✅ Bot data loaded from API:', {
          botId,
          nodeCount: apiFlow.flowData.nodes?.length || 0,
          edgeCount: apiFlow.flowData.edges?.length || 0
        });
      } else {
        throw new Error('No flow data in API response');
      }
    } catch (error) {
      console.warn('⚠️ API load failed, will load from localStorage in editor:', error.message);
    }

    setCurrentBotId(botId);
    setCurrentView('editor');
  }, [loadFlowFromDatabase]);

  const handleBackToManagement = useCallback(() => {
    console.log('🔙 Returning to management view');
    
    setCurrentView('management');
    setCurrentBotId(null);
  }, []);

  return {
    currentView,
    currentBotId,
    setCurrentBotId,
    handleCreateNewBot,
    handleEditBot,
    handleBackToManagement
  };
};