import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from './Sidebar';
import ComponentPanel from './ComponentPanel';
import FlowCanvas from './FlowCanvas';
import Header from './Header';
import NodeEditor from './NodeEditor';
import SaveModal from './SaveModal';
import DatabaseSaveModal from './DatabaseSaveModal';

const EditorView = ({
  // UI State
  sidebarOpen,
  componentPanelOpen,
  onToggleSidebar,
  onToggleComponentPanel,
  
  // Flow Data
  flowData,
  editingNode,
  onFlowDataChange,
  onNodeEdit,
  onCloseEditor,
  
  // Actions
  onExport,
  onImport,
  onBack,
  onSave,
  onPublish,
  
  // Bot Info
  currentBotId,
  
  // Publishing State
  isPublishing,
  publishError,
  
  // Save Modals
  showSaveModal,
  showDatabaseSaveModal,
  savedBotName,
  dbLoading,
  dbError,
  onDatabaseSave,
  onCloseSaveModal,
  onCloseDatabaseSaveModal
}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
        <Sidebar onToggleSidebar={onToggleSidebar} />
      </div>
      
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <Header 
          onExport={onExport}
          onImport={onImport}
          flowData={flowData}
          onBack={onBack}
          botId={currentBotId}
          onToggleSidebar={onToggleSidebar}
          onToggleComponentPanel={onToggleComponentPanel}
          onSave={onSave}
          onPublish={onPublish}
          isPublishing={isPublishing}
          publishError={publishError}
        />
        
        <div className="flex-1 flex h-full min-h-0">
          {/* Component Panel Overlay for Mobile */}
          {componentPanelOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={onToggleComponentPanel}
            />
          )}
          
          {/* Component Panel */}
          <div className={`${
            componentPanelOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 top-16 z-40 transition-transform duration-300 ease-in-out`}>
            <ComponentPanel 
              onDragStart={onDragStart} 
              onClose={onToggleComponentPanel}
            />
          </div>
          
          <div className="flex-1 h-full min-w-0">
            <ReactFlowProvider>
              <FlowCanvas 
              flowData={flowData}
                onFlowDataChange={onFlowDataChange}
                onNodeEdit={onNodeEdit}
              />
              
              {/* NodeEditor now inside ReactFlowProvider context */}
              {editingNode && (
                <NodeEditor
                  nodeId={editingNode.id}
                  nodeData={editingNode.data}
                  onClose={onCloseEditor}
                />
              )}
            </ReactFlowProvider>
          </div>
        </div>
      </div>
      
      {/* Save Success Modal */}
      <SaveModal
        isOpen={showSaveModal}
        onClose={onCloseSaveModal}
        botName={savedBotName}
        nodeCount={flowData.nodes.length}
      />

      {/* Database Save Modal */}
      <DatabaseSaveModal
        isOpen={showDatabaseSaveModal}
        onClose={onCloseDatabaseSaveModal}
        onSave={onDatabaseSave}
        loading={dbLoading}
        error={dbError}
        initialName={savedBotName}
        isUpdate={!!currentBotId}
      />
    </div>
  );
};

export default EditorView;