import React from 'react';
import * as Icons from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, botName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icons.Trash2 size={24} className="text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Bot</h2>
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete <span className="font-medium text-gray-900">"{botName}"</span>? 
            This action cannot be undone.
          </p>
        </div>
        
        {/* Actions */}
        <div className="px-6 pb-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;