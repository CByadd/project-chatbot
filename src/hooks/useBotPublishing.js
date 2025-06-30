import { useState, useCallback } from 'react';
import { useFlowDatabase } from './useFlowDatabase';

export const useBotPublishing = (currentBotId) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const { publishFlow } = useFlowDatabase();

  const handlePublish = useCallback(async () => {
    console.log('🚀 Publish requested:', { currentBotId });

    if (!currentBotId) {
      console.warn('⚠️ Cannot publish: No bot ID');
      alert('Please save the flow first before publishing');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      await publishFlow(currentBotId);
      console.log('✅ Flow published successfully');
      alert('Flow published successfully!');
    } catch (error) {
      console.error('❌ Publish failed:', error);
      setPublishError(error.message);
    } finally {
      setIsPublishing(false);
    }
  }, [currentBotId, publishFlow]);

  return {
    isPublishing,
    publishError,
    handlePublish
  };
};