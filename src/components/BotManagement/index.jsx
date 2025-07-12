import React, { useState, useEffect } from 'react';
import BotHeader from './BotHeader';
import BotFilters from './BotFilters';
import BotGrid from './BotGrid';
import DeleteModal from '../DeleteModal';
import { flowAPI } from '../../services/api';

const BotManagement = ({ onCreateNew, onEditBot, onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    botId: '',
    botName: ''
  });

  // Load flows from API on component mount
  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    console.log('📚 Loading flows from API...');
    setLoading(true);
    setError(null);
    
    try {
      // Try to load from API first
      const apiFlows = await flowAPI.getFlows();
      console.log('✅ Flows loaded from API:', apiFlows);
      
      // Transform API data to match local format
      const transformedFlows = apiFlows.map(flow => ({
        id: flow.id,
        name: flow.name,
        botName: flow.name, // Use name as botName for display
        description: flow.description || `Chatbot flow with ${flow.nodeCount || 0} nodes`,
        status: flow.status || 'draft',
        lastModified: flow.lastModified || flow.updatedAt || new Date().toISOString(),
        messageCount: flow.messageCount || 0,
        flowNodes: flow.nodeCount || (flow.flowData?.nodes?.length || 0),
        isPublished: flow.status === 'published' || flow.isPublished || false
      }));
      
      console.log('🔄 Transformed flows:', transformedFlows);
      setBots(transformedFlows);
      
      // Also sync with localStorage for offline access
      localStorage.setItem('saved-bots', JSON.stringify(transformedFlows));
      
    } catch (apiError) {
      console.warn('⚠️ API load failed, falling back to localStorage:', apiError.message);
      
      // Fallback to localStorage
      const savedBots = localStorage.getItem('saved-bots');
      if (savedBots) {
        try {
          const localBots = JSON.parse(savedBots);
          console.log('✅ Flows loaded from localStorage:', localBots);
          setBots(localBots);
        } catch (parseError) {
          console.error('❌ Error parsing localStorage data:', parseError);
          setBots([]);
        }
      } else {
        setBots([]);
      }
      
      setError('Unable to connect to server. Showing local data only.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (botId, currentStatus) => {
    console.log('🔄 Toggling bot status:', { botId, currentStatus });
    
    try {
      let updatedFlow;
      
      if (currentStatus === 'published' || currentStatus === 'active') {
        // Unpublish the bot
        updatedFlow = await flowAPI.unpublishFlow(botId);
        console.log('⏸️ Bot unpublished successfully:', updatedFlow);
      } else {
        // Publish the bot
        updatedFlow = await flowAPI.publishFlow(botId);
        console.log('🚀 Bot published successfully:', updatedFlow);
      }
      
      // Update local state immediately for better UX
      setBots(prevBots => 
        prevBots.map(bot => {
          if (bot.id === botId) {
            const newStatus = (currentStatus === 'published' || currentStatus === 'active') ? 'draft' : 'published';
            const newIsPublished = newStatus === 'published';
            return {
              ...bot,
              status: updatedFlow.status || newStatus,
              isPublished: updatedFlow.isPublished !== undefined ? updatedFlow.isPublished : newIsPublished
            };
          }
          return bot;
        })
      );
      
      // Reload flows to get the latest state from server
      setTimeout(() => {
        loadFlows();
      }, 500);
      
    } catch (error) {
      console.error('❌ Status toggle failed:', error);
      
      // Fallback to local state update
      setBots(prevBots => {
        const updatedBots = prevBots.map(bot => {
          if (bot.id === botId) {
            const newStatus = (currentStatus === 'published' || currentStatus === 'active') ? 'draft' : 'published';
            return { 
              ...bot, 
              status: newStatus,
              isPublished: newStatus === 'published'
            };
          }
          return bot;
        });
        
        // Save to localStorage as backup
        localStorage.setItem('saved-bots', JSON.stringify(updatedBots));
        return updatedBots;
      });
      
      alert(`Failed to ${currentStatus === 'published' ? 'unpublish' : 'publish'} bot: ${error.message}`);
    }
  };

  const handleDeleteBot = (botId, botName) => {
    setDeleteModal({ isOpen: true, botId, botName });
  };

  const confirmDeleteBot = async () => {
    const { botId } = deleteModal;
    console.log('🗑️ Deleting bot:', { botId });
    
    try {
      // Try to delete from API
      await flowAPI.deleteFlow(botId);
      console.log('✅ Bot deleted from API successfully');
      
      // Remove from local state
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
      
      // Also remove from localStorage
      const savedBots = JSON.parse(localStorage.getItem('saved-bots') || '[]');
      const updatedBots = savedBots.filter(bot => bot.id !== botId);
      localStorage.setItem('saved-bots', JSON.stringify(updatedBots));
      
      // Remove local flow data
      localStorage.removeItem(`chatbot-flow-${botId}`);
      localStorage.removeItem(`chatbot-name-${botId}`);
      
    } catch (error) {
      console.error('❌ API delete failed:', error);
      
      // Fallback to local deletion only
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
      
      const savedBots = JSON.parse(localStorage.getItem('saved-bots') || '[]');
      const updatedBots = savedBots.filter(bot => bot.id !== botId);
      localStorage.setItem('saved-bots', JSON.stringify(updatedBots));
      
      localStorage.removeItem(`chatbot-flow-${botId}`);
      localStorage.removeItem(`chatbot-name-${botId}`);
      
      alert(`Warning: Bot deleted locally but may still exist on server: ${error.message}`);
    }
    
    setDeleteModal({ isOpen: false, botId: '', botName: '' });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, botId: '', botName: '' });
  };

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'active') {
      matchesFilter = bot.status === 'published' || bot.isPublished;
    } else if (filterStatus === 'inactive') {
      matchesFilter = bot.status !== 'published' && !bot.isPublished;
    } else if (filterStatus !== 'all') {
      matchesFilter = bot.status === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  const activeBotCount = bots.filter(bot => bot.status === 'published' || bot.isPublished).length;

  return (
    <>
      <div className="flex-1 bg-gray-50 h-screen flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <BotHeader
          onCreateNew={onCreateNew}
          onToggleSidebar={onToggleSidebar}
          onRefresh={loadFlows}
          loading={loading}
          error={error}
          activeBotCount={activeBotCount}
        />

        {/* Filters and Search - Fixed */}
        <BotFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filteredCount={filteredBots.length}
          totalCount={bots.length}
        />

        {/* Bot Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <BotGrid
            bots={filteredBots}
            loading={loading}
            onCreateNew={onCreateNew}
            onEditBot={onEditBot}
            onDeleteBot={handleDeleteBot}
            onToggleActive={handleToggleActive}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            refreshBots={loadFlows}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteBot}
        botName={deleteModal.botName}
      />
    </>
  );
};

export default BotManagement;