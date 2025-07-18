import React from 'react';
import * as Icons from 'lucide-react';
import FileUploadButton from '../FileUpload/FileUploadButton';
import FilePreview from '../FileUpload/FilePreview';

const StandardNodeEditor = ({ 
  nodeType, 
  formData, 
  setFormData, 
  onOpenNodeSelector 
}) => {
  const addListItem = () => {
    setFormData(prev => ({
      ...prev,
      listItems: [...(prev.listItems || []), 'New Item']
    }));
  };

  const updateListItem = (itemIndex, value) => {
    setFormData(prev => ({
      ...prev,
      listItems: prev.listItems?.map((item, index) =>
        index === itemIndex ? value : item
      )
    }));
  };

  const removeListItem = (itemIndex) => {
    setFormData(prev => ({
      ...prev,
      listItems: prev.listItems?.filter((_, index) => index !== itemIndex)
    }));
  };

  // File upload handlers using the new hook
  const handleFileUploaded = (fileData, fieldName) => {
    console.log('📁 File uploaded for field:', fieldName, fileData);
    setFormData(prev => ({
      ...prev,
      [fieldName]: fileData.url,
      [`${fieldName}FileName`]: fileData.fileName,
      [`${fieldName}FileSize`]: fileData.fileSize,
      [`${fieldName}FileType`]: fileData.fileType
    }));
  };

  const handleFileRemoved = (fieldName) => {
    console.log('🗑️ File removed for field:', fieldName);
    setFormData(prev => ({
      ...prev,
      [fieldName]: '',
      [`${fieldName}FileName`]: '',
      [`${fieldName}FileSize`]: 0,
      [`${fieldName}FileType`]: ''
    }));
  };

  const handleUrlChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
      // Clear file metadata when URL is manually entered
      [`${fieldName}FileName`]: '',
      [`${fieldName}FileSize`]: 0,
      [`${fieldName}FileType`]: ''
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Edit {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node
        </h3>
        <p className="text-gray-600 text-sm">Configure the settings for this {nodeType} component</p>
      </div>

      {nodeType === 'trigger' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
            <input
              acceptedTypes=".jpg,.jpeg,.png"
              value={formData.trigger || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
              placeholder="hi, hello, start"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple keywords with commas</p>
          </div>
          
          {/* Message Source Connection for Trigger */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-green-800 mb-2">
              <Icons.Zap size={16} className="inline mr-2" />
              Message Source Node
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenNodeSelector(null, 'trigger')}
                className="flex-1 px-3 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm flex items-center justify-center"
              >
                <Icons.ArrowRight size={14} className="mr-2" />
                {formData.nextNodeId ? `Gets message from: ${formData.nextNodeId}` : 'Select Message Source'}
              </button>
              {formData.nextNodeId && (
                <button
                  onClick={() => setFormData(prev => ({ ...prev, nextNodeId: '' }))}
                  className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  <Icons.Unlink size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-green-600 mt-2">
              <Icons.Info size={12} className="inline mr-1" />
              When triggered, this will send the message from the connected node instead of its own text
            </p>
          </div>
        </div>
      )}

      {(nodeType === 'text' || nodeType === 'image' || nodeType === 'video' || nodeType === 'document' || nodeType === 'list') && (
        <div className="space-y-4">
          {nodeType === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Text</label>
              <textarea
                value={formData.text || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your message"
                rows={6}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
            </div>
          )}

          {nodeType === 'image' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption Text</label>
                <textarea
                  value={formData.text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter image caption"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                
                {formData.imageUrl ? (
                  <FilePreview
                    fileUrl={formData.imageUrl}
                    fileName={formData.imageUrlFileName || 'Uploaded Image'}
                    fileType={formData.imageUrlFileType || 'image/jpeg'}
                    fileSize={formData.imageUrlFileSize || 0}
                    onRemove={() => handleFileRemoved('imageUrl')}
                  />
                ) : (
                  <FileUploadButton
                    onFileUploaded={(fileData) => handleFileUploaded(fileData, 'imageUrl')}
                    acceptedTypes="image/*"
                    buttonText="Upload Image"
                    buttonIcon="Image"
                    maxSize={10 * 1024 * 1024} // 10MB for images
                    fileCategory="image"
                  />
                )}
                
                {/* Manual URL Input */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Or enter image URL manually:</label>
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleUrlChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {nodeType === 'video' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption Text</label>
                <textarea
                  value={formData.text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter video caption"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
                />
              </div>
              
              {/* Video Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
                
                {formData.videoUrl ? (
                  <FilePreview
                    fileUrl={formData.videoUrl}
                    fileName={formData.videoUrlFileName || 'Uploaded Video'}
                    fileType={formData.videoUrlFileType || 'video/mp4'}
                    fileSize={formData.videoUrlFileSize || 0}
                    onRemove={() => handleFileRemoved('videoUrl')}
                  />
                ) : (
                  <FileUploadButton
                    onFileUploaded={(fileData) => handleFileUploaded(fileData, 'videoUrl')}
                    acceptedTypes="video/*"
                    buttonText="Upload Video"
                    buttonIcon="Video"
                    maxSize={50 * 1024 * 1024} // 50MB for videos
                    fileCategory="video"
                  />
                )}
                
                {/* Manual URL Input */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Or enter video URL manually:</label>
                  <input
                    type="url"
                    value={formData.videoUrl || ''}
                    onChange={(e) => handleUrlChange('videoUrl', e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {nodeType === 'document' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Text</label>
                <textarea
                  value={formData.text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter message text"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                />
              </div>
              
              {/* Document Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document</label>
                
                {formData.documentUrl ? (
                  <FilePreview
                    fileUrl={formData.documentUrl}
                    fileName={formData.documentUrlFileName || 'Uploaded Document'}
                    fileType={formData.documentUrlFileType || 'application/pdf'}
                    fileSize={formData.documentUrlFileSize || 0}
                    onRemove={() => handleFileRemoved('documentUrl')}
                  />
                ) : (
                  <FileUploadButton
                    onFileUploaded={(fileData) => handleFileUploaded(fileData, 'documentUrl')}
                    acceptedTypes=".pdf,.doc,.docx,.txt"
                    buttonText="Upload Document"
                    buttonIcon="FileText"
                    maxSize={25 * 1024 * 1024} // 25MB for documents
                    fileCategory="document"
                  />
                )}
                
                {/* Manual URL Input */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Or enter document URL manually:</label>
                  <input
                    type="url"
                    value={formData.documentUrl || ''}
                    onChange={(e) => handleUrlChange('documentUrl', e.target.value)}
                    placeholder="https://example.com/document.pdf"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {nodeType === 'list' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Text</label>
                <textarea
                  value={formData.text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter message before list"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">List Items</label>
                <div className="space-y-2">
                  {(formData.listItems || []).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateListItem(itemIndex, e.target.value)}
                        placeholder={`Item ${itemIndex + 1}`}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeListItem(itemIndex)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addListItem}
                    className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-yellow-300 hover:text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center justify-center font-medium text-sm"
                  >
                    <Icons.Plus size={16} className="mr-2" />
                    Add List Item
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Auto-flow Connection for all node types */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              <Icons.ArrowRight size={16} className="inline mr-2" />
              Auto-flow to Next Node
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenNodeSelector(null, 'next')}
                className="flex-1 px-3 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center"
              >
                <Icons.ArrowRight size={14} className="mr-2" />
                {formData.nextNodeId ? `Flows to: ${formData.nextNodeId}` : 'Set Next Node'}
              </button>
              {formData.nextNodeId && (
                <button
                  onClick={() => setFormData(prev => ({ ...prev, nextNodeId: '' }))}
                  className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  <Icons.Unlink size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-blue-600 mt-2">
              <Icons.Info size={12} className="inline mr-1" />
              Automatically continue to the next node after sending this message
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardNodeEditor;