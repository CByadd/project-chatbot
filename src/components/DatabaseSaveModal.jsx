import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const DatabaseSaveModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  loading = false, 
  error = null,
  initialName = '',
  isUpdate = false 
}) => {
  const [botName, setBotName] = useState(initialName);
  const [saveToCloud, setSaveToCloud] = useState(true);

  const handleSave = () => {
    if (botName.trim()) {
      onSave(botName.trim(), saveToCloud);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isUpdate ? 'Update Flow' : 'Save Flow'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {isUpdate ? 'Update your chatbot flow' : 'Save your chatbot flow to the database'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Icons.X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <Icons.AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 text-sm font-medium">Save Failed</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Bot Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chatbot Name
            </label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter chatbot name"
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
            />
          </div>

          {/* Save Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icons.Cloud size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Save to Database</p>
                  <p className="text-gray-600 text-xs">Sync across devices and backup online</p>
                </div>
              </div>
              <button
                onClick={() => setSaveToCloud(!saveToCloud)}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                  saveToCloud ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    saveToCloud ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Local Storage Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
            <Icons.Info size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 text-sm">
                {saveToCloud 
                  ? 'Flow will be saved to both database and local storage for offline access.'
                  : 'Flow will only be saved locally in your browser.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !botName.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Icons.Loader2 size={16} className="mr-2 animate-spin" />
                {isUpdate ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Icons.Save size={16} className="mr-2" />
                {isUpdate ? 'Update' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSaveModal;