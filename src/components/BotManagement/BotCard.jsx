import React from 'react';
import * as Icons from 'lucide-react';

const BotCard = ({ bot, onEdit, onDelete, onToggleActive }) => {
  // Determine if the bot is currently published
  const isBotActive = bot.status === 'published' || bot.isPublished || false;
  const displayStatus = isBotActive ? 'active' : (bot.status || 'draft');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'published':
        return <Icons.CheckCircle size={14} className="text-green-600" />;
      case 'inactive':
        return <Icons.XCircle size={14} className="text-red-600" />;
      case 'draft':
        return <Icons.Clock size={14} className="text-yellow-600" />;
      default:
        return <Icons.Circle size={14} className="text-gray-600" />;
    }
  };

  const handleTogglePublish = async (e) => {
    e.stopPropagation();
    
    if (onToggleActive) {
      try {
        await onToggleActive(bot.id, bot.status);
      } catch (error) {
        console.error('Failed to toggle publish status:', error);
      }
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
      onClick={() => onEdit(bot.id)}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icons.Bot size={20} className="text-white" />
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(displayStatus)}`}>
              {getStatusIcon(displayStatus)}
              <span className="capitalize">{displayStatus}</span>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleTogglePublish}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isBotActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={isBotActive ? 'Unpublish bot' : 'Publish bot'}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isBotActive ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
          {bot.botName || bot.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {bot.description}
        </p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{(bot.messageCount || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500">Messages</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{bot.flowNodes || 0}</div>
            <div className="text-xs text-gray-500">Flow Nodes</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last modified</span>
          <span>{new Date(bot.lastModified).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(bot.id);
            }}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
          >
            <Icons.Edit2 size={14} className="mr-1" />
            Edit Flow
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(bot.id, bot.name);
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
              title="Delete"
            >
              <Icons.Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotCard;