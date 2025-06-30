import React from 'react';
import * as Icons from 'lucide-react';

const BotHeader = ({ 
  onCreateNew, 
  onToggleSidebar, 
  onRefresh, 
  loading, 
  error, 
  activeBotCount 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0">
          {/* Mobile menu button */}
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="lg:hidden mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.Menu size={20} className="text-gray-600" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Chatbot Management</h1>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-600 text-sm hidden sm:block">
                Create and manage your conversational flows • 
                <span className="ml-1 font-medium text-green-600">
                  {activeBotCount} active bot{activeBotCount !== 1 ? 's' : ''}
                </span>
              </p>
              {error && (
                <div className="flex items-center space-x-1 text-orange-600">
                  <Icons.AlertTriangle size={14} />
                  <span className="text-xs">Offline mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh flows"
          >
            <Icons.RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onCreateNew}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center font-medium shadow-md hover:shadow-lg text-sm flex-shrink-0"
          >
            <Icons.Plus size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Create New Bot</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotHeader;