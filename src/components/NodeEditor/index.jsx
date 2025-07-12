import React, { useState, useCallback, useMemo } from 'react';
import { useReactFlow } from 'reactflow';
import * as Icons from 'lucide-react';
import NodeSelector from './NodeSelector';
import ComponentSelector from './ComponentSelector';
import ButtonEditor from './ButtonEditor';
import CatalogEditor from './CatalogEditor';
import ListEditor from './ListEditor';
import StandardNodeEditor from './StandardNodeEditor';
import NodeContainerEditor from './NodeContainerEditor';

const NodeEditor = ({ nodeId, nodeData, onClose }) => {
  const { setNodes, getNodes } = useReactFlow();
  const [formData, setFormData] = useState({
    ...nodeData,
    components: nodeData.components || []
  });

  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [showComponentSelector, setShowComponentSelector] = useState(false);
  const [selectorType, setSelectorType] = useState('');

  // Memoize available nodes to prevent unnecessary re-renders
  const availableNodes = useMemo(() => 
    getNodes().filter(node => node.id !== nodeId), 
    [getNodes, nodeId]
  );
  
  const availableComponents = useMemo(() => [
    { type: 'trigger', label: 'Triggers', icon: 'Zap', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
    { type: 'text', label: 'Text', icon: 'MessageSquare', color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
    { type: 'image', label: 'Image', icon: 'Image', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
    { type: 'video', label: 'Video', icon: 'Video', color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100' },
    { type: 'document', label: 'Document', icon: 'FileText', color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100' },
    { type: 'list', label: 'List', icon: 'List', color: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' },
    { type: 'catalog', label: 'Catalog', icon: 'Grid3X3', color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' }
  ], []);

  const openNodeSelector = useCallback((buttonIndex, type = 'button') => {
    setSelectedButtonIndex(buttonIndex);
    setSelectorType(type);
    setShowNodeSelector(true);
  }, []);

  const selectTargetNode = useCallback((targetNodeId) => {
    if (selectorType === 'button' && selectedButtonIndex !== null) {
      setFormData(prev => ({
        ...prev,
        buttons: prev.buttons?.map((button, btnIndex) =>
          btnIndex === selectedButtonIndex
            ? { ...button, nextNodeId: targetNodeId }
            : button
        )
      }));
    } else if (selectorType === 'list' && selectedButtonIndex !== null) {
      setFormData(prev => ({
        ...prev,
        listButtons: prev.listButtons?.map((listButton, btnIndex) =>
          btnIndex === selectedButtonIndex
            ? { ...listButton, nextNodeId: targetNodeId }
            : listButton
        )
      }));
    } else if (selectorType === 'trigger' || selectorType === 'next') {
      setFormData(prev => ({
        ...prev,
        nextNodeId: targetNodeId
      }));
    }
    setShowNodeSelector(false);
    setSelectedButtonIndex(null);
    setSelectorType('');
  }, [selectorType, selectedButtonIndex]);

  const addComponent = useCallback((componentType) => {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: componentType,
      data: getDefaultComponentData(componentType)
    };
    
    setFormData(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
    setShowComponentSelector(false);
  }, []);

  const getDefaultComponentData = useCallback((type) => {
    const defaults = {
      trigger: { trigger: '', text: 'Hello! How can I help you?' },
      text: { text: 'Enter text' },
      image: { text: 'Enter text', imageUrl: '' },
      video: { text: 'Enter text', videoUrl: '' },
      document: { text: 'Enter text', documentUrl: '' },
      list: { text: 'Enter text', listButtons: [{ label: 'Item 1', nextNodeId: '' }, { label: 'Item 2', nextNodeId: '' }] },
      catalog: { text: 'Enter text', catalog: { title: 'Catalog Title', items: ['Product 1', 'Product 2'] } }
    };
    return defaults[type] || defaults.text;
  }, []);

  const handleSave = useCallback(() => {
    console.log('💾 Saving node changes:', {
      nodeId,
      nodeType: nodeData.type,
      hasComponents: formData.components?.length > 0,
      hasListButtons: formData.listButtons?.length > 0
    });

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...formData,
                components: formData.components.length > 0 ? formData.components : undefined,
              }
            }
          : node
      )
    );
    onClose();
  }, [nodeId, nodeData.type, formData, setNodes, onClose]);

  const renderEditor = useCallback(() => {
    const nodeType = nodeData.type;

    // Special handling for button nodes
    if (nodeType === 'button') {
      return (
        <ButtonEditor
          formData={formData}
          setFormData={setFormData}
          onOpenNodeSelector={openNodeSelector}
        />
      );
    }

    // Special handling for catalog nodes
    if (nodeType === 'catalog') {
      return (
        <CatalogEditor
          formData={formData}
          setFormData={setFormData}
        />
      );
    }

    // Special handling for list nodes
    if (nodeType === 'list') {
      return (
        <ListEditor
          formData={formData}
          setFormData={setFormData}
          onOpenNodeSelector={openNodeSelector}
        />
      );
    }

    // For node containers, show component management
    if (nodeType === 'node') {
      return (
        <NodeContainerEditor
          formData={formData}
          setFormData={setFormData}
          onOpenComponentSelector={() => setShowComponentSelector(true)}
          availableComponents={availableComponents}
        />
      );
    }

    // For direct node types, show their specific editing interface
    return (
      <StandardNodeEditor
        nodeType={nodeType}
        formData={formData}
        setFormData={setFormData}
        onOpenNodeSelector={openNodeSelector}
      />
    );
  }, [nodeData.type, formData, openNodeSelector, availableComponents]);

  return (
    <>
      {/* Main Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[3000] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Flow Node</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Configure settings for this node</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button 
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                >
                  <Icons.Check size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button 
                  onClick={onClose}
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
                >
                  <Icons.X size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {renderEditor()}
          </div>
        </div>
      </div>

      {/* Component Selector Modal */}
      <ComponentSelector
        isOpen={showComponentSelector}
        onClose={() => setShowComponentSelector(false)}
        onSelect={addComponent}
        availableComponents={availableComponents}
      />

      {/* Node Selector Modal */}
      <NodeSelector
        isOpen={showNodeSelector}
        onClose={() => setShowNodeSelector(false)}
        onSelect={selectTargetNode}
        availableNodes={availableNodes}
        selectorType={selectorType}
      />
    </>
  );
};

export default NodeEditor;