import { useCallback } from 'react';

export const useFlowActions = (flowData, currentBotId) => {
  const exportFlowData = useCallback(() => {
    console.log('📤 Exporting flow data...');
    
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const botName = currentBotId ? (localStorage.getItem(`chatbot-name-${currentBotId}`) || `Bot-${currentBotId}`) : 'new-bot';
    const exportFileDefaultName = `${botName}-flow-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    console.log('✅ Flow data exported:', {
      fileName: exportFileDefaultName,
      size: dataStr.length,
      nodeCount: flowData.nodes.length
    });
  }, [flowData, currentBotId]);

  const importFlowData = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📥 Importing flow data:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result);
          // This will be handled by the parent component
          return importedData;
        } catch (error) {
          console.error('❌ Import failed:', {
            error: error.message,
            fileName: file.name
          });
          alert('Error importing file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      const jsonString = JSON.stringify(flowData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      alert('Flow data copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  }, [flowData]);

  return {
    exportFlowData,
    importFlowData,
    copyToClipboard
  };
};