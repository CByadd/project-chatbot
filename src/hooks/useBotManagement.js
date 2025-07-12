import { useState, useCallback } from 'react';

export const useBotManagement = () => {
  const [currentView, setCurrentView] = useState('management');
  const [currentBotId, setCurrentBotId] = useState(null);

  const handleCreateNewBot = useCallback(() => {
    console.log('🆕 Creating new bot - clearing all state...');
    
    // Force clear current bot ID first
    setCurrentBotId(null);
    
    // Small delay to ensure state is cleared before switching views
    setTimeout(() => {
      setCurrentView('editor');
      console.log('✅ Switched to editor view for new bot');
    }, 50);
  }, []);

  const handleEditBot = useCallback((botId) => {
    console.log('✏️ Editing specific bot:', { 
      botId, 
      previousBotId: currentBotId,
      isNewBot: botId !== currentBotId 
    });
    
    // Always set the bot ID first, even if it's the same
    // This ensures the flow editor reloads the correct data
    setCurrentBotId(botId);
    
    // Small delay to ensure bot ID is set before switching views
    setTimeout(() => {
      setCurrentView('editor');
      console.log('✅ Switched to editor view for bot:', botId);
    }, 50);
  }, [currentBotId]);

  const handleBackToManagement = useCallback(() => {
    console.log('🔙 Returning to management view from bot:', currentBotId);
    setCurrentView('management');
    // Don't clear currentBotId here to maintain context for potential return
  }, [currentBotId]);

  // Function to update bot ID after successful save
  const updateCurrentBotId = useCallback((newBotId) => {
    console.log('🆔 Updating current bot ID:', { from: currentBotId, to: newBotId });
    setCurrentBotId(newBotId);
  }, [currentBotId]);

  // Function to force refresh the current bot's data
  const refreshCurrentBot = useCallback(() => {
    if (currentBotId) {
      console.log('🔄 Forcing refresh of current bot:', currentBotId);
      // Temporarily clear and reset to force reload
      const botId = currentBotId;
      setCurrentBotId(null);
      setTimeout(() => {
        setCurrentBotId(botId);
      }, 100);
    }
  }, [currentBotId]);

  return {
    currentView,
    currentBotId,
    setCurrentBotId,
    updateCurrentBotId,
    handleCreateNewBot,
    handleEditBot,
    handleBackToManagement,
    refreshCurrentBot
  };
};