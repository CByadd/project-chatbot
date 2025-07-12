import { useState, useCallback } from 'react';
import { useFlowDatabase } from './useFlowDatabase';
import { useToast } from './useToast';

export const useBotPublishing = (currentBotId) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const { showSuccess, showError } = useToast();

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
      showSuccess('Bot has been published successfully!', 'Published');
      
    } catch (error) {
      console.error('❌ Publish failed:', error);
      setPublishError(error.message);
      showError(`Failed to publish bot: ${error.message}`, 'Publish Failed');
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
        showSuccess('Bot has been unpublished successfully!', 'Unpublished');
      } else if (action === 'publish') {
        await publishFlow(currentBotId);
        console.log('🚀 Bot published successfully');
        showSuccess('Bot has been published successfully!', 'Published');
      }

    } catch (error) {
      console.error('❌ Toggle publish failed:', error);
      setPublishError(error.message);
      showError(`Failed to ${action} bot: ${error.message}`, 'Operation Failed');
      throw error; // Re-throw to let the caller handle it
    } finally {
      setIsPublishing(false);
    }
  }, [currentBotId, publishFlow, unpublishFlow]);

  return {
    isPublishing,
    publishError,
    handlePublish,
    handleTogglePublish,
    showSuccess,
    showError
  };
};