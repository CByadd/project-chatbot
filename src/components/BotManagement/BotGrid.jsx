import React from 'react';
import * as Icons from 'lucide-react';
import BotCard from './BotCard';

const BotGrid = ({ 
  bots, 
  loading, 
  onCreateNew, 
  onEditBot, 
  onDeleteBot, 
  onToggleActive,
  searchTerm,
  filterStatus 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.Loader2 size={32} className="animate-spin text-purple-600 mr-3" />
        <span className="text-gray-600">Loading flows...</span>
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.Bot size={28} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {searchTerm || filterStatus !== 'all' ? 'No bots found' : 'No bots created yet'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm px-4">
          {searchTerm || filterStatus !== 'all' 
            ? 'Try adjusting your search or filter criteria'
            : 'Get started by creating your first chatbot to automate conversations'
          }
        </p>
        {(!searchTerm && filterStatus === 'all') && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center font-medium text-sm"
          >
            <Icons.Plus size={16} className="mr-2" />
            Create Your First Bot
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {bots.map((bot) => (
        <BotCard
          key={bot.id}
          bot={bot}
          onEdit={onEditBot}
          onDelete={onDeleteBot}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default BotGrid;