import React from 'react';
import * as Icons from 'lucide-react';

const SaveModal = ({ isOpen, onClose, botName, nodeCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[3000] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Minimal Header */}
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icons.Check size={24} className="text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Saved!</h2>
          <p className="text-gray-600 text-sm">{botName} • {nodeCount} nodes</p>
        </div>
        
        {/* Simple Action */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;