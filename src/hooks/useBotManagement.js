import { useState, useCallback } from 'react';

export const useBotManagement = () => {
  const [currentView, setCurrentView] = useState('management');
  const [currentBotId, setCurrentBotId] = useState(null);

  const handleCreateNewBot = useCallback(() => {
    console.log('🆕 Creating new bot...');
    setCurrentBotId(null); // Clear current bot ID for new bot
    setCurrentView('editor');
  }, []);

  const handleEditBot = useCallback((botId) => {
    console.log('✏️ Editing bot:', { botId });
    setCurrentBotId(botId);
    setCurrentView('editor');
  }, []);

  const handleBackToManagement = useCallback(() => {
    console.log('🔙 Returning to management view');
    setCurrentView('management');
    // Don't clear currentBotId here to maintain context
  }, []);

  // New function to update bot ID after successful save
  const updateCurrentBotId = useCallback((newBotId) => {
    console.log('🆔 Updating current bot ID:', { from: currentBotId, to: newBotId });
    setCurrentBotId(newBotId);
  }, [currentBotId]);

  return {
    currentView,
    currentBotId,
    setCurrentBotId,
    updateCurrentBotId,
    handleCreateNewBot,
    handleEditBot,
    handleBackToManagement
  };
};