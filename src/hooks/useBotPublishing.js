import { useState, useCallback } from 'react';
import { useFlowDatabase } from './useFlowDatabase';

export const useBotPublishing = (currentBotId) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const { publishFlow, unpublishFlow } = useFlowDatabase();

  const handlePublish = useCallback(async () => {
    if (!currentBotId) {
      console.warn('⚠️ No bot ID provided for publishing');
      alert('Please save the flow first before publishing');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      console.log('🚀 Publishing bot:', currentBotId);
      const result = await publishFlow(currentBotId);
      console.log('✅ Bot published successfully:', result);
      alert('Bot published successfully!');
      
    } catch (error) {
      console.error('❌ Publish failed:', error);
      setPublishError(error.message);
      alert(`Failed to publish bot: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  }, [currentBotId, publishFlow]);

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
        console.log('⏸️ Bot unpublished successfully');
      } else if (action === 'publish') {
        await publishFlow(currentBotId);
        console.log('🚀 Bot published successfully');
      }

    } catch (error) {
      console.error('❌ Toggle publish failed:', error);
      setPublishError(error.message);
      throw error; // Re-throw to let the caller handle it
    } finally {
      setIsPublishing(false);
    }
  }, [currentBotId, publishFlow, unpublishFlow]);

  return {
    isPublishing,
    publishError,
    handlePublish,
    handleTogglePublish
  };
};