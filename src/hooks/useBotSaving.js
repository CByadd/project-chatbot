import { useState, useCallback } from 'react';
import { useFlowDatabase } from './useFlowDatabase';

export const useBotSaving = (currentBotId, flowData) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDatabaseSaveModal, setShowDatabaseSaveModal] = useState(false);
  const [savedBotName, setSavedBotName] = useState('');

  const {
    loading: dbLoading,
    error: dbError,
    clearError: clearDbError,
    saveFlowToDatabase
  } = useFlowDatabase();

  const handleSaveBot = useCallback((botName) => {
    console.log('💾 Save bot requested:', {
      botName,
      currentBotId,
      nodeCount: flowData.nodes.length
    });

    setSavedBotName(botName);
    setShowDatabaseSaveModal(true);
  }, [currentBotId, flowData]);

  const handleDatabaseSave = useCallback(async (botName, saveToCloud) => {
    console.log('💾 Database save initiated:', {
      botName,
      saveToCloud,
      currentBotId,
      nodeCount: flowData.nodes.length,
      isNewBot: !currentBotId
    });

    if (!saveToCloud) {
      console.log('💾 Local save only...');
      // Local save only
      const botId = currentBotId || `bot_${Date.now()}`;
      
      const storageKey = `chatbot-flow-${botId}`;
      localStorage.setItem(storageKey, JSON.stringify(flowData));
      localStorage.setItem(`chatbot-name-${botId}`, botName);
      
      const savedBots = JSON.parse(localStorage.getItem('saved-bots') || '[]');
      const existingBotIndex = savedBots.findIndex((bot) => bot.id === botId);
      
      const botData = {
        id: botId,
        name: botName,
        description: `Chatbot flow with ${flowData.nodes.length} nodes`,
        status: 'draft',
        lastModified: new Date().toISOString(),
        messageCount: 0,
        flowNodes: flowData.nodes.length
      };
      
      if (existingBotIndex >= 0) {
        savedBots[existingBotIndex] = { ...savedBots[existingBotIndex], ...botData };
      } else {
        savedBots.push(botData);
      }
      
      localStorage.setItem('saved-bots', JSON.stringify(savedBots));
      
      console.log('✅ Local save completed:', {
        botId,
        botName,
        storageKey,
        isNewBot: !currentBotId
      });
      
      setShowDatabaseSaveModal(false);
      setSavedBotName(botName);
      setShowSaveModal(true);
      return { id: botId };
    }

    try {
      clearDbError();
      
      // Ensure we have valid flow data
      if (!flowData || !flowData.nodes || flowData.nodes.length === 0) {
        throw new Error('Cannot save empty flow. Please add at least one node.');
      }
      
      const result = await saveFlowToDatabase(flowData, botName, currentBotId);
      
      // Also save locally as backup
      const botId = result.id || currentBotId;
      if (botId) {
        const storageKey = `chatbot-flow-${botId}`;
        localStorage.setItem(storageKey, JSON.stringify(flowData));
        localStorage.setItem(`chatbot-name-${botId}`, botName);
        
        // Update saved bots list
        const savedBots = JSON.parse(localStorage.getItem('saved-bots') || '[]');
        const existingBotIndex = savedBots.findIndex((bot) => bot.id === botId);
        
        const botData = {
          id: botId,
          name: botName,
          description: result.description || `Chatbot flow with ${flowData.nodes.length} nodes`,
          status: result.status || 'draft',
          lastModified: result.lastModified || new Date().toISOString(),
          messageCount: result.messageCount || 0,
          flowNodes: flowData.nodes.length
        };
        
        if (existingBotIndex >= 0) {
          savedBots[existingBotIndex] = { ...savedBots[existingBotIndex], ...botData };
        } else {
          savedBots.push(botData);
        }
        
        localStorage.setItem('saved-bots', JSON.stringify(savedBots));
      }
      
      setShowDatabaseSaveModal(false);
      setSavedBotName(botName);
      setShowSaveModal(true);
      
      console.log('✅ Database save completed successfully:', {
        botId: result.id,
        isNewBot: !currentBotId,
        name: botName
      });
      
      return result;
    } catch (error) {
      console.error('❌ Database save failed:', error);
      // Modal will show the error, don't close it
      throw error;
    }
  }, [currentBotId, flowData, saveFlowToDatabase, clearDbError]);

  const handleCloseSaveModal = useCallback(() => {
    console.log('❌ Save modal closed');
    setShowSaveModal(false);
  }, []);

  const handleCloseDatabaseSaveModal = useCallback(() => {
    console.log('❌ Database save modal closed');
    setShowDatabaseSaveModal(false);
    clearDbError();
  }, [clearDbError]);

  return {
    showSaveModal,
    showDatabaseSaveModal,
    savedBotName,
    dbLoading,
    dbError,
    handleSaveBot,
    handleDatabaseSave,
    handleCloseSaveModal,
    handleCloseDatabaseSaveModal
  };
};