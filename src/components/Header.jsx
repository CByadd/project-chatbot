import React, { useState,useEffect } from 'react';
import * as Icons from 'lucide-react';

const Header = ({ 
  onExport, 
  onImport, 
  flowData, 
  onBack, 
  botId, 
  botName: propBotName,
  onBotNameChange,
  onToggleSidebar,
  onToggleComponentPanel,
  onSave,
  onPublish,
  isPublishing = false,
  publishError = null
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [botName, setBotName] = useState(propBotName || 'New Chatbot Flow');
  const [tempName, setTempName] = useState(botName);

  // Update local state when prop changes
  useEffect(() => {
    const newName = propBotName || (botId ? `Bot ${botId}` : 'New Chatbot Flow');
    setBotName(newName);
    setTempName(newName);
  }, [propBotName, botId]);

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = onImport;
    input.click();
  };

  const copyToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(flowData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      alert('Flow data copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleNameEdit = () => {
    setTempName(botName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setBotName(tempName.trim());
      if (onBotNameChange) {
        onBotNameChange(tempName.trim());
      }
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setTempName(botName);
    setIsEditingName(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(botName);
    }
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0">
          {/* Mobile menu buttons */}
          <div className="flex items-center space-x-2 lg:hidden mr-3">
            {onToggleSidebar && (
              <button 
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle sidebar"
              >
                <Icons.Menu size={20} className="text-gray-600" />
              </button>
            )}
            {onToggleComponentPanel && (
              <button 
                onClick={onToggleComponentPanel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                title="Toggle components"
              >
                <Icons.Package size={20} className="text-gray-600" />
              </button>
            )}
          </div>
          
          {onBack && (
            <button 
              onClick={onBack}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Icons.ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}
          <div className="min-w-0">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleNameSave}
                  className="text-lg sm:text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none min-w-0"
                  autoFocus
                />
                <button
                  onClick={handleNameSave}
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                >
                  <Icons.Check size={16} />
                </button>
                <button
                  onClick={handleNameCancel}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <Icons.X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{botName}</h1>
                <button
                  onClick={handleNameEdit}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Edit name"
                >
                  <Icons.Edit2 size={16} />
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600 hidden sm:block">Design your conversation flow</p>
              {publishError && (
                <div className="flex items-center space-x-1 text-red-600">
                  <Icons.AlertCircle size={14} />
                  <span className="text-xs">Publish failed</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            <button 
              onClick={copyToClipboard}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              title="Copy JSON to clipboard"
            >
              <Icons.Copy size={16} className="mr-2" />
              Copy JSON
            </button>
            
            <button 
              onClick={handleImportClick}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Icons.Upload size={16} className="mr-2" />
              Import
            </button>
            
            <button 
              onClick={onExport}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Icons.Download size={16} className="mr-2" />
              Export
            </button>
          </div>
          
          {/* Mobile action menu */}
          <div className="sm:hidden">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Icons.MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
          
          <button 
            onClick={handleSave}
            className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Icons.Save size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Save</span>
            <span className="sm:hidden">Save</span>
          </button>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <Icons.Loader2 size={16} className="mr-1 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">Publishing...</span>
                <span className="sm:hidden">Pub...</span>
              </>
            ) : (
              <>
                <Icons.Play size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Publish</span>
                <span className="sm:hidden">Pub</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;