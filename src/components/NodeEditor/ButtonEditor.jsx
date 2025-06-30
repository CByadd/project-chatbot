import React from 'react';
import * as Icons from 'lucide-react';

const ButtonEditor = ({ 
  formData, 
  setFormData, 
  onOpenNodeSelector 
}) => {
  const addButton = () => {
    const newButton = {
      label: '',
      description: '',
      imageUrl: '',
      nextNodeId: ''
    };
    
    setFormData(prev => ({
      ...prev,
      buttons: [...(prev.buttons || []), newButton]
    }));
  };

  const updateButton = (buttonIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons?.map((button, index) =>
        index === buttonIndex ? { ...button, [field]: value } : button
      )
    }));
  };

  const removeButton = (buttonIndex) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons?.filter((_, index) => index !== buttonIndex)
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reply Buttons</h3>
        <p className="text-gray-600 text-sm">Configure your interactive button responses</p>
      </div>

      {/* Header Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header Type</label>
        <select className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
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
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.text || '').length}/1024
        </div>
      </div>

      {/* Buttons Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Buttons (up to 3)</label>
        <div className="space-y-3">
          {(formData.buttons || []).map((button, buttonIndex) => (
            <div key={buttonIndex} className="space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <input
                  type="text"
                  value={button.label || ''}
                  onChange={(e) => updateButton(buttonIndex, 'label', e.target.value)}
                  placeholder="Enter option text"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="text-xs text-gray-400 min-w-[40px] text-center">
                  {(button.label || '').length}/20
                </div>
                <button
                  onClick={() => removeButton(buttonIndex)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <Icons.X size={16} />
                </button>
              </div>
              
              {/* Connect to Node Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenNodeSelector(buttonIndex, 'button')}
                  className="flex-1 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center justify-center"
                >
                  <Icons.Link size={14} className="mr-2" />
                  {button.nextNodeId ? `Connected to: ${button.nextNodeId}` : 'Connect to Node'}
                </button>
                {button.nextNodeId && (
                  <button
                    onClick={() => updateButton(buttonIndex, 'nextNodeId', '')}
                    className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <Icons.Unlink size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Button */}
          {(!formData.buttons || formData.buttons.length < 3) && (
            <button
              onClick={addButton}
              className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center font-medium text-sm"
            >
              <Icons.Plus size={16} className="mr-2" />
              Add Button
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ButtonEditor;