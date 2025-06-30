import React from 'react';
import * as Icons from 'lucide-react';

const NodeSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  availableNodes, 
  selectorType 
}) => {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (selectorType) {
      case 'trigger':
        return 'Select Message Source';
      case 'next':
        return 'Set Next Node';
      default:
        return 'Connect to Node';
    }
  };

  const getDescription = () => {
    switch (selectorType) {
      case 'trigger':
        return 'Select which node provides the message to send when triggered';
      case 'next':
        return 'Select the next node in the flow';
      default:
        return 'Select which node this button should navigate to';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {getTitle()}
          </h3>
          <p className="text-gray-600 mt-1 text-sm">
            {getDescription()}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {availableNodes.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <Icons.AlertCircle size={40} className="mx-auto mb-4 text-gray-300 sm:w-12 sm:h-12" />
              <h4 className="text-base sm:text-lg font-semibold mb-2">No nodes available</h4>
              <p className="text-sm px-4">Create more nodes in your flow to connect them together</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => onSelect(node.id)}
                  className="w-full p-3 sm:p-4 text-left border-2 border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 flex-shrink-0">
                      <Icons.Box size={18} className="text-purple-600 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {node.data.label || `${node.data.type} Node`}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">Node ID: {node.id}</div>
                      {selectorType === 'trigger' && node.data.text && (
                        <div className="text-xs text-gray-600 mt-1 truncate">
                          Message: "{node.data.text.substring(0, 50)}..."
                        </div>
                      )}
                    </div>
                    <Icons.ChevronRight className="text-gray-400 group-hover:text-purple-600 flex-shrink-0" size={18} />
                  </div>
                </button>
              ))}
            </div>
          )}
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

export default NodeSelector;