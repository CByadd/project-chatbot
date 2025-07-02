// hooks/useBotPublishing.js
import { useState, useCallback } from 'react';
import { useFlowDatabase } from './useFlowDatabase';

export const useBotPublishing = (currentBotId, onRefresh) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const { publishFlow, unpublishFlow } = useFlowDatabase();

  const handleTogglePublish = useCallback(async (action) => {
    if (!currentBotId) {
      console.warn('⚠️ No bot ID provided');
      alert('Please save the flow first before publishing');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      if (action === 'unpublish') {
        await unpublishFlow(currentBotId);
        alert('Bot unpublished successfully');
      } else if (action === 'publish') {
        await publishFlow(currentBotId);
        alert('Bot published successfully');
      }

      // ✅ Refresh flows after toggling publish state
      if (typeof onRefresh === 'function') {
        onRefresh();
      }

    } catch (error) {
      console.error('❌ Toggle publish failed:', error);
      setPublishError(error.message);
    } finally {
      setIsPublishing(false);
    }
  }, [currentBotId, publishFlow, unpublishFlow, onRefresh]);

  return {
    isPublishing,
    publishError,
    handleTogglePublish
  };
};
