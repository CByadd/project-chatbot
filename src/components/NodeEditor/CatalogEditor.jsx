import React from 'react';
import * as Icons from 'lucide-react';

const CatalogEditor = ({ 
  formData, 
  setFormData 
}) => {
  const addCatalogItem = () => {
    setFormData(prev => ({
      ...prev,
      catalog: {
        ...prev.catalog,
        items: [...(prev.catalog?.items || []), 'New Product']
      }
    }));
  };

  const updateCatalogItem = (itemIndex, value) => {
    setFormData(prev => ({
      ...prev,
      catalog: {
        ...prev.catalog,
        items: prev.catalog?.items?.map((item, index) =>
          index === itemIndex ? value : item
        )
      }
    }));
  };

  const removeCatalogItem = (itemIndex) => {
    setFormData(prev => ({
      ...prev,
      catalog: {
        ...prev.catalog,
        items: prev.catalog?.items?.filter((_, index) => index !== itemIndex)
      }
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Catalog</h3>
        <p className="text-gray-600 text-sm">Configure your product catalog display</p>
      </div>

      {/* Header Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header Type</label>
        <select className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm">
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
      </div>

      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header</label>
        <input
          type="text"
          value={formData.header || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, header: e.target.value }))}
          placeholder="Enter header text"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.header || '').length}/60
        </div>
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
        <textarea
          value={formData.text || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Enter body text"
          rows={4}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.text || '').length}/1024
        </div>
      </div>

      {/* Catalog Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Catalog Title</label>
        <input
          type="text"
          value={formData.catalog?.title || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            catalog: { ...prev.catalog, title: e.target.value } 
          }))}
          placeholder="Enter catalog title"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Catalog Items Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Catalog Items (up to 10)</label>
        <div className="space-y-3">
          {(formData.catalog?.items || []).map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-center space-x-2 sm:space-x-3">
              <input
                type="text"
                value={item}
                onChange={(e) => updateCatalogItem(itemIndex, e.target.value)}
                placeholder="Enter product name"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <div className="text-xs text-gray-400 min-w-[40px] text-center">
                {item.length}/30
              </div>
              <button
                onClick={() => removeCatalogItem(itemIndex)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
              >
                <Icons.X size={16} />
              </button>
            </div>
          ))}
          
          {/* Add Catalog Item */}
          {(!formData.catalog?.items || formData.catalog.items.length < 10) && (
            <button
              onClick={addCatalogItem}
              className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center font-medium text-sm"
            >
              <Icons.Plus size={16} className="mr-2" />
              Add Catalog Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogEditor;