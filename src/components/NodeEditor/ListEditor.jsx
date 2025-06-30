import React from 'react';
import * as Icons from 'lucide-react';

const ListEditor = ({ 
  formData, 
  setFormData, 
  onOpenNodeSelector 
}) => {
  const addListButton = () => {
    const newListButton = {
      label: '',
      description: '',
      nextNodeId: ''
    };
    
    setFormData(prev => ({
      ...prev,
      listButtons: [...(prev.listButtons || []), newListButton]
    }));
  };

  const updateListButton = (buttonIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      listButtons: prev.listButtons?.map((button, index) =>
        index === buttonIndex ? { ...button, [field]: value } : button
      )
    }));
  };

  const removeListButton = (buttonIndex) => {
    setFormData(prev => ({
      ...prev,
      listButtons: prev.listButtons?.filter((_, index) => index !== buttonIndex)
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive List</h3>
        <p className="text-gray-600 text-sm">Configure your interactive list with clickable items</p>
      </div>

      {/* Header Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header Type</label>
        <select className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm">
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
      </div>

      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header</label>
        <input
          type="text"
          value={formData.header || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, header: e.target.value }))}
          placeholder="Enter header text"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.header || '').length}/60
        </div>
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
        <textarea
          value={formData.text || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Enter body text"
          rows={4}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.text || '').length}/1024
        </div>
      </div>

      {/* List Items Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">List Items (up to 10)</label>
        <div className="space-y-3">
          {(formData.listButtons || []).map((listButton, buttonIndex) => (
            <div key={buttonIndex} className="space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <input
                  type="text"
                  value={listButton.label || ''}
                  onChange={(e) => updateListButton(buttonIndex, 'label', e.target.value)}
                  placeholder="Enter list item text"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                />
                <div className="text-xs text-gray-400 min-w-[40px] text-center">
                  {(listButton.label || '').length}/30
                </div>
                <button
                  onClick={() => removeListButton(buttonIndex)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <Icons.X size={16} />
                </button>
              </div>
              
              {/* Description field */}
              <div className="ml-0">
                <input
                  type="text"
                  value={listButton.description || ''}
                  onChange={(e) => updateListButton(buttonIndex, 'description', e.target.value)}
                  placeholder="Enter description (optional)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* Connect to Node Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenNodeSelector(buttonIndex, 'list')}
                  className="flex-1 px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm flex items-center justify-center"
                >
                  <Icons.Link size={14} className="mr-2" />
                  {listButton.nextNodeId ? `Connected to: ${listButton.nextNodeId}` : 'Connect to Node'}
                </button>
                {listButton.nextNodeId && (
                  <button
                    onClick={() => updateListButton(buttonIndex, 'nextNodeId', '')}
                    className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <Icons.Unlink size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add List Item */}
          {(!formData.listButtons || formData.listButtons.length < 10) && (
            <button
              onClick={addListButton}
              className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-yellow-300 hover:text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center justify-center font-medium text-sm"
            >
              <Icons.Plus size={16} className="mr-2" />
              Add List Item
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Footer (optional)</label>
        <input
          type="text"
          value={formData.footer || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, footer: e.target.value }))}
          placeholder="Enter footer text"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.footer || '').length}/60
        </div>
      </div>
    </div>
  );
};

export default ListEditor;