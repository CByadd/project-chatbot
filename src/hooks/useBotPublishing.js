import { useState, useCallback } from 'react';
import { useFlowDatabase } from './useFlowDatabase';

export const useBotPublishing = (currentBotId) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const { publishFlow, unpublishFlow } = useFlowDatabase();

  const handleTogglePublish = useCallback(async (currentStatus) => {
    if (!currentBotId) {
      console.warn('⚠️ No bot ID provided');
      alert('Please save the flow first before publishing');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      if (currentStatus === 'active') {
        await unpublishFlow(currentBotId);
        console.log('🚫 Unpublished bot:', currentBotId);
        alert('Bot unpublished successfully');
      } else {
        await publishFlow(currentBotId);
        console.log('✅ Published bot:', currentBotId);
        alert('Bot published successfully');
      }
    } catch (error) {
      console.error('❌ Toggle publish failed:', error);
      setPublishError(error.message);
    } finally {
      setIsPublishing(false);
    }
  }, [currentBotId, publishFlow, unpublishFlow]);

  return {
    isPublishing,
    publishError,
    handleTogglePublish // ✅ ensure this is returned
  };
};
