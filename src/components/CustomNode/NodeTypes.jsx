import React from 'react';
import * as Icons from 'lucide-react';

export const ButtonNode = ({ 
  data, 
  onEdit, 
  onDelete 
}) => {
  const buttons = data.buttons || [];
  
  // Render header media preview
  const renderHeaderMedia = () => {
    if (data.headerType === 'image' && data.headerImageUrl) {
      return (
        <div className="mb-3">
          <div className="relative w-full h-16 bg-gray-100 rounded border overflow-hidden">
            <img 
              src={data.headerImageUrl} 
              alt="Header"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <Icons.ImageOff size={16} className="text-gray-400" />
            </div>
          </div>
          {data.headerImageUrlFileName && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              📎 {data.headerImageUrlFileName}
            </div>
          )}
        </div>
      );
    }

    if (data.headerType === 'video' && data.headerVideoUrl) {
      return (
        <div className="mb-3">
          <div className="relative w-full h-16 bg-gray-100 rounded border overflow-hidden">
            <video 
              src={data.headerVideoUrl}
              className="w-full h-full object-cover"
              muted
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <Icons.VideoOff size={16} className="text-gray-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <Icons.Play size={10} className="text-white ml-0.5" />
              </div>
            </div>
          </div>
          {data.headerVideoUrlFileName && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              📎 {data.headerVideoUrlFileName}
            </div>
          )}
        </div>
      );
    }

    if (data.headerType === 'document' && data.headerDocumentUrl) {
      return (
        <div className="mb-3">
          <div className="w-full h-12 bg-gray-100 rounded border flex items-center justify-center p-2">
            <div className="flex items-center space-x-2">
              <Icons.FileText size={14} className="text-gray-400" />
              <div className="text-xs text-gray-600 truncate">
                {data.headerDocumentUrlFileName || 'Document'}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };
  
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg min-w-[250px] sm:min-w-[280px] max-w-[320px] relative group">
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10 shadow-md"
        title="Delete node"
      >
        <Icons.X size={14} />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Icons.MessageSquare size={14} className="text-green-600 sm:w-4 sm:h-4" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Reply buttons</span>
        </div>
        <button
          onClick={onEdit}
          className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-md flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <Icons.Plus size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Header Media Preview */}
        {renderHeaderMedia()}

        {/* Header Text */}
        {data.header && (
          <div className="text-xs sm:text-sm font-medium text-gray-800 mb-2">
            {data.header}
          </div>
        )}

        {/* Body Text */}
        <div className="text-xs sm:text-sm text-gray-600 mb-3">
          {data.text || 'Offer quick responses'}
        </div>
        
        {/* Button List */}
        <div className="space-y-2">
          {buttons.length > 0 ? (
            buttons.map((button, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 relative">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    {button.label || 'Enter text'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="text-xs text-gray-400">
                    {button.label ? `${button.label.length}/20` : '0/20'}
                  </div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-400">Enter text</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400">0/20</div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {data.footer && (
          <div className="text-xs text-gray-500 mt-3 text-center">
            {data.footer}
          </div>
        )}

        {/* Add button */}
        <div className="flex justify-end mt-3">
          <button
            onClick={onEdit}
            className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
          >
            <Icons.Plus size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const CatalogNode = ({ 
  data, 
  onEdit, 
  onDelete 
}) => {
  const catalogItems = data.catalog?.items || [];
  
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg min-w-[250px] sm:min-w-[280px] max-w-[320px] relative group">
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10 shadow-md"
        title="Delete node"
      >
        <Icons.X size={14} />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Icons.Grid3X3 size={14} className="text-indigo-600 sm:w-4 sm:h-4" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Catalog</span>
        </div>
        <button
          onClick={onEdit}
          className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-500 text-white rounded-md flex items-center justify-center hover:bg-indigo-600 transition-colors"
        >
          <Icons.Plus size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600 mb-3">
          {data.text || 'Browse our catalog'}
        </div>
        
        {/* Catalog Title */}
        {data.catalog?.title && (
          <div className="text-xs sm:text-sm font-medium text-gray-800 mb-3">
            {data.catalog.title}
          </div>
        )}
        
        {/* Catalog Items List */}
        <div className="space-y-2">
          {catalogItems.length > 0 ? (
            catalogItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 relative">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    {item || 'Product item'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="text-xs text-gray-400">
                    {item ? `${item.length}/30` : '0/30'}
                  </div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {['Product 1', 'Product 2', 'Product 3'].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-400">{product}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400">0/30</div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Add item button */}
        <div className="flex justify-end mt-3">
          <button
            onClick={onEdit}
            className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
          >
            <Icons.Plus size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ListNode = ({ 
  data, 
  onEdit, 
  onDelete 
}) => {
  const listButtons = data.listButtons || [];
  
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg min-w-[250px] sm:min-w-[280px] max-w-[320px] relative group">
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10 shadow-md"
        title="Delete node"
      >
        <Icons.X size={14} />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icons.List size={14} className="text-yellow-600 sm:w-4 sm:h-4" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Interactive List</span>
        </div>
        <button
          onClick={onEdit}
          className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 text-white rounded-md flex items-center justify-center hover:bg-yellow-600 transition-colors"
        >
          <Icons.Plus size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600 mb-3">
          {data.text || 'Choose from the list:'}
        </div>
        
        {/* List Items */}
        <div className="space-y-2">
          {listButtons.length > 0 ? (
            listButtons.map((listItem, index) => (
              <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 relative">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-700 truncate">
                    {listItem.label || 'List item'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="text-xs text-gray-400">
                    {listItem.label ? `${listItem.label.length}/30` : '0/30'}
                  </div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-400">List item {index + 1}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400">0/30</div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Add item button */}
        <div className="flex justify-end mt-3">
          <button
            onClick={onEdit}
            className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
          >
            <Icons.Plus size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const StandardNode = ({ 
  id,
  data, 
  selected, 
  onEdit, 
  onDelete,
  onAddButtons
}) => {
  const getNodeConfig = (type) => {
    const configs = {
      node: { icon: 'Box', color: 'bg-slate-50 border-slate-300 text-slate-700' },
      trigger: { icon: 'Zap', color: 'bg-green-50 border-green-300 text-green-700' },
      text: { icon: 'MessageSquare', color: 'bg-blue-50 border-blue-300 text-blue-700' },
      image: { icon: 'Image', color: 'bg-purple-50 border-purple-300 text-purple-700' },
      video: { icon: 'Video', color: 'bg-pink-50 border-pink-300 text-pink-700' },
      document: { icon: 'FileText', color: 'bg-orange-50 border-orange-300 text-orange-700' },
      list: { icon: 'List', color: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
      template: { icon: 'Layout', color: 'bg-teal-50 border-teal-300 text-teal-700' }
    };
    return configs[type] || configs.text;
  };

  const config = getNodeConfig(data.type);
  const Icon = Icons[config.icon];

  const renderComponentPreview = (component) => {
    const componentConfigs = {
      trigger: { icon: 'Zap', color: 'text-green-600', label: 'Triggers' },
      text: { icon: 'MessageSquare', color: 'text-blue-600', label: 'Text' },
      image: { icon: 'Image', color: 'text-purple-600', label: 'Image' },
      video: { icon: 'Video', color: 'text-pink-600', label: 'Video' },
      document: { icon: 'FileText', color: 'text-orange-600', label: 'Document' },
      list: { icon: 'List', color: 'text-yellow-600', label: 'List' },
      catalog: { icon: 'Grid3X3', color: 'text-indigo-600', label: 'Catalog' }
    };
    
    const componentConfig = componentConfigs[component.type] || componentConfigs.text;
    const ComponentIcon = Icons[componentConfig.icon];
    
    return (
      <div key={component.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg text-xs shadow-sm">
        <div className="flex items-center space-x-2">
          {ComponentIcon && <ComponentIcon size={14} className={componentConfig.color} />}
          <span className="font-medium text-gray-700">{componentConfig.label}</span>
          {component.data.buttons && component.data.buttons.length > 0 && (
            <span className="text-gray-500">({component.data.buttons.length})</span>
          )}
        </div>
        <button
          onClick={onEdit}
          className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Icons.Edit2 size={12} />
        </button>
      </div>
    );
  };

  // Render file preview for media nodes
  const renderMediaPreview = () => {
    if (data.type === 'image' && data.imageUrl) {
      return (
        <div className="mt-2">
          <div className="relative w-full h-20 bg-gray-100 rounded border overflow-hidden">
            <img 
              src={data.imageUrl} 
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <Icons.ImageOff size={16} className="text-gray-400" />
            </div>
          </div>
          {data.imageUrlFileName && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              📎 {data.imageUrlFileName}
            </div>
          )}
        </div>
      );
    }

    if (data.type === 'video' && data.videoUrl) {
      return (
        <div className="mt-2">
          <div className="relative w-full h-20 bg-gray-100 rounded border overflow-hidden">
            <video 
              src={data.videoUrl}
              className="w-full h-full object-cover"
              muted
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <Icons.VideoOff size={16} className="text-gray-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <Icons.Play size={12} className="text-white ml-0.5" />
              </div>
            </div>
          </div>
          {data.videoUrlFileName && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              📎 {data.videoUrlFileName}
            </div>
          )}
        </div>
      );
    }

    if (data.type === 'document' && data.documentUrl) {
      return (
        <div className="mt-2">
          <div className="w-full h-16 bg-gray-100 rounded border flex items-center justify-center p-2">
            <div className="flex items-center space-x-2">
              <Icons.FileText size={16} className="text-gray-400" />
              <div className="text-xs text-gray-600 truncate">
                {data.documentUrlFileName || 'Document'}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Check if node has buttons
  const hasButtons = data.buttons && data.buttons.length > 0;

  return (
    <div 
      className={`px-4 sm:px-5 py-3 sm:py-4 shadow-lg rounded-xl border-2 bg-white min-w-[250px] sm:min-w-[300px] max-w-[340px] cursor-pointer transition-all duration-200 relative group ${config.color} ${selected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'}`}
      onDoubleClick={onEdit}
    >
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10 shadow-md"
        title="Delete node"
      >
        <Icons.X size={14} />
      </button>
      
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {Icon && <Icon size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />}
          <div className="font-semibold text-sm sm:text-base truncate">{data.label}</div>
        </div>
        <div className="flex items-center space-x-1">
          {/* Add Buttons Icon - Show for all non-button nodes */}
          {data.type !== 'button' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onAddButtons) {
                  onAddButtons(id, data);
                }
              }}
              className="p-1.5 sm:p-2 hover:bg-white hover:bg-opacity-60 rounded-lg transition-colors flex-shrink-0"
              title="Add buttons to this message"
            >
              <Icons.Square size={14} className="sm:w-4 sm:h-4 text-green-600" />
            </button>
          )}
          
          <button
            onClick={onEdit}
            className="p-1.5 sm:p-2 hover:bg-white hover:bg-opacity-60 rounded-lg transition-colors flex-shrink-0"
          >
            <Icons.Edit2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      
      {/* Node-specific content */}
      {data.type === 'node' && data.components && data.components.length > 0 && (
        <div className="space-y-2">
          {data.components.slice(0, 4).map((component) => renderComponentPreview(component))}
          {data.components.length > 4 && (
            <div className="text-xs text-gray-500 text-center py-2 bg-gray-50 rounded-lg">
              +{data.components.length - 4} more components
            </div>
          )}
        </div>
      )}
      
      {/* Empty state for node */}
      {data.type === 'node' && (!data.components || data.components.length === 0) && (
        <div className="text-center py-4 sm:py-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          <Icons.Package size={24} className="mx-auto mb-2 text-gray-300 sm:w-7 sm:h-7" />
          <p className="text-xs font-medium">No components</p>
          <p className="text-xs">Double-click to add</p>
        </div>
      )}
      
      {/* Special display for trigger nodes */}
      {data.type === 'trigger' && (
        <div className="space-y-2">
          {data.trigger && (
            <div className="text-xs">
              <span className="font-medium text-green-700">Keywords:</span> 
              <span className="ml-1 text-gray-600">{data.trigger}</span>
            </div>
          )}
          
          {data.nextNodeId && (
            <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
              <Icons.Merge size={12} className="inline mr-1 text-green-600" />
              <span className="font-medium text-green-700">Merges data from:</span>
              <span className="ml-1 text-gray-600">{data.nextNodeId}</span>
            </div>
          )}
          
          {!data.nextNodeId && (
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
              <Icons.AlertTriangle size={12} className="inline mr-1" />
              Connect to a message node to merge data
            </div>
          )}
        </div>
      )}
      
      {/* Legacy content for backward compatibility */}
      {data.type !== 'node' && data.type !== 'trigger' && (
        <div className="space-y-2">
          {data.text && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              {data.text.length > 60 ? `${data.text.substring(0, 60)}...` : data.text}
            </div>
          )}
          
          {/* Media preview */}
          {renderMediaPreview()}
          
          {data.listButtons && data.listButtons.length > 0 && (
            <div className="text-xs">
              <span className="font-medium text-yellow-700">List Items:</span>
              <span className="ml-1 text-gray-600">{data.listButtons.length} items</span>
            </div>
          )}

          {/* Show buttons indicator */}
          {hasButtons && (
            <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
              <Icons.Square size={12} className="inline mr-1 text-green-600" />
              <span className="font-medium text-green-700">Has buttons:</span>
              <span className="ml-1 text-gray-600">{data.buttons.length} button{data.buttons.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Show auto-flow connection indicator */}
          {data.nextNodeId && (
            <div className="text-xs">
              <span className="font-medium text-blue-700">Auto-flows to:</span>
              <span className="ml-1 text-gray-600">{data.nextNodeId}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};