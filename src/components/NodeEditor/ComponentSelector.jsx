import React from 'react';
import * as Icons from 'lucide-react';

const ComponentSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  availableComponents 
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName, className = '') => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={16} className={className} /> : <Icons.Circle size={16} className={className} />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[3000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add Component</h3>
          <p className="text-gray-600 mt-1 text-sm">Choose a component type to add to this node</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {availableComponents.map((component) => (
              <button
                key={component.type}
                onClick={() => onSelect(component.type)}
                className={`p-4 sm:p-6 text-left border-2 rounded-xl hover:shadow-lg transition-all group ${component.color}`}
              >
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                    {renderIcon(component.icon, 'text-gray-600')}
                  </div>
                  <span className="font-semibold text-center text-sm sm:text-base">{component.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 sm:py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentSelector;