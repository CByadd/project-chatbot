// components/SuccessModal.jsx
import React from 'react';
import * as Icons from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
        <Icons.CheckCircle className="text-green-500 w-8 h-8 mx-auto mb-3" />
        <h2 className="text-center text-lg font-semibold mb-2">Success</h2>
        <p className="text-center text-gray-600 mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
