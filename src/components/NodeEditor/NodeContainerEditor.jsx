import React from 'react';
import * as Icons from 'lucide-react';

const NodeContainerEditor = ({ 
  formData, 
  setFormData, 
  onOpenComponentSelector,
  availableComponents 
}) => {
  const renderIcon = (iconName, className = '') => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={16} className={className} /> : <Icons.Circle size={16} className={className} />;
  };

  const removeComponent = (componentId) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== componentId)
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Node Components</h3>
          <p className="text-gray-600 text-sm">Add and configure components for this conversation node</p>
        </div>
        <button
          onClick={onOpenComponentSelector}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center font-medium shadow-sm text-sm"
        >
          <Icons.Plus size={18} className="mr-2" />
          Add Component
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {formData.components.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
            <Icons.Package size={40} className="mx-auto mb-4 text-gray-300 sm:w-12 sm:h-12" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No components added yet</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 px-4">Start building your conversation flow by adding components</p>
            <button
              onClick={onOpenComponentSelector}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center font-medium text-sm"
            >
              <Icons.Plus size={18} className="mr-2" />
              Add Your First Component
            </button>
          </div>
        ) : (
          formData.components.map((component, index) => {
            const componentConfig = availableComponents.find(c => c.type === component.type);
            if (!componentConfig) return null;

            return (
              <div key={component.id} className={`border-2 rounded-xl p-4 sm:p-6 ${componentConfig.color} relative shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {renderIcon(componentConfig.icon, 'text-gray-600')}
                    </div>
                    <span className="font-semibold text-base sm:text-lg">{componentConfig.label}</span>
                  </div>
                  <button
                    onClick={() => removeComponent(component.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Icons.Trash2 size={16} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
                {/* Component editing would go here */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NodeContainerEditor;