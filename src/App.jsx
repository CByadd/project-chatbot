import React, { useCallback } from 'react';
import { useFlowDatabase } from './hooks/useFlowDatabase';
import { useBotManagement } from './hooks/useBotManagement';
import { useFlowEditor } from './hooks/useFlowEditor';
import { useFlowActions } from './hooks/useFlowActions';
import { useBotSaving } from './hooks/useBotSaving';
import { useBotPublishing } from './hooks/useBotPublishing';
import { useUIState } from './hooks/useUIState';
import { useAppInitialization } from './hooks/useAppInitialization';
import ConnectionStatus from './components/ConnectionStatus';
import ManagementView from './components/ManagementView';
import EditorView from './components/EditorView';
import SimpleAxiosDemo from './components/SimpleAxiosDemo';
import 'reactflow/dist/style.css';

function App() {
  // Initialize app
  useAppInitialization();

  // Database connection
  const { connectionStatus } = useFlowDatabase();

  // Bot management state
  const {
    currentView,
    currentBotId,
    setCurrentBotId,
    handleCreateNewBot,
    handleEditBot,
    handleBackToManagement
  } = useBotManagement();

  // Flow editor state
  const {
    flowData,
    editingNode,
    handleFlowDataChange,
    handleNodeEdit,
    handleCloseEditor
  } = useFlowEditor(currentBotId);

  // Flow actions
  const {
    exportFlowData,
    copyToClipboard
  } = useFlowActions(flowData, currentBotId);

  // Bot saving
  const {
    showSaveModal,
    showDatabaseSaveModal,
    savedBotName,
    dbLoading,
    dbError,
    handleSaveBot,
    handleDatabaseSave,
    handleCloseSaveModal,
    handleCloseDatabaseSaveModal
  } = useBotSaving(currentBotId, flowData);

  // Bot publishing
  const {
    isPublishing,
    publishError,
    handlePublish
  } = useBotPublishing(currentBotId);

  // UI state
  const {
    sidebarOpen,
    componentPanelOpen,
    handleToggleSidebar,
    handleToggleComponentPanel
  } = useUIState();

  // Import flow data handler
  const handleImportFlowData = useCallback((event) => {
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
          handleFlowDataChange(importedData);
          
          const storageKey = currentBotId ? `chatbot-flow-${currentBotId}` : 'chatbot-flow';
          localStorage.setItem(storageKey, JSON.stringify(importedData));

          console.log('✅ Flow data imported successfully:', {
            nodeCount: importedData.nodes?.length || 0,
            edgeCount: importedData.edges?.length || 0,
            storageKey
          });
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
  }, [currentBotId, handleFlowDataChange]);

  // Enhanced database save handler that updates current bot ID
  const handleEnhancedDatabaseSave = useCallback(async (botName, saveToCloud) => {
    try {
      const result = await handleDatabaseSave(botName, saveToCloud);
      
      // Update current bot ID if this was a new bot
      if (result?.id && !currentBotId) {
        setCurrentBotId(result.id);
        console.log('🆔 Bot ID updated after save:', result.id);
      }
      
      return result;
    } catch (error) {
      // Error is already handled in the hook
      throw error;
    }
  }, [handleDatabaseSave, currentBotId, setCurrentBotId]);

  // Render appropriate view
  if (currentView === 'management') {
    return (
      <>
        <ManagementView
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          onCreateNew={handleCreateNewBot}
          onEditBot={handleEditBot}
        />
        
        {/* Connection Status Indicator */}
        <ConnectionStatus connectionStatus={connectionStatus} />
      </>
    );
  }

  return (
    <>
      <EditorView
        // UI State
        sidebarOpen={sidebarOpen}
        componentPanelOpen={componentPanelOpen}
        onToggleSidebar={handleToggleSidebar}
        onToggleComponentPanel={handleToggleComponentPanel}
        
        // Flow Data
        flowData={flowData}
        editingNode={editingNode}
        onFlowDataChange={handleFlowDataChange}
        onNodeEdit={handleNodeEdit}
        onCloseEditor={handleCloseEditor}
        
        // Actions
        onExport={exportFlowData}
        onImport={handleImportFlowData}
        onBack={handleBackToManagement}
        onSave={handleSaveBot}
        onPublish={handlePublish}
        
        // Bot Info
        currentBotId={currentBotId}
        
        // Publishing State
        isPublishing={isPublishing}
        publishError={publishError}
        
        // Save Modals
        showSaveModal={showSaveModal}
        showDatabaseSaveModal={showDatabaseSaveModal}
        savedBotName={savedBotName}
        dbLoading={dbLoading}
        dbError={dbError}
        onDatabaseSave={handleEnhancedDatabaseSave}
        onCloseSaveModal={handleCloseSaveModal}
        onCloseDatabaseSaveModal={handleCloseDatabaseSaveModal}
      />
      
      {/* Connection Status Indicator */}
      <ConnectionStatus connectionStatus={connectionStatus} />
      
      {/* Simple Axios Demo Button */}
      <SimpleAxiosDemo />
    </>
  );
}

export default App;