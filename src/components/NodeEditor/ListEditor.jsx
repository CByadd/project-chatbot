import React from 'react';
import * as Icons from 'lucide-react';
import FileUploadButton from '../FileUpload/FileUploadButton';
import FilePreview from '../FileUpload/FilePreview';

const ListEditor = ({ 
  formData, 
  setFormData, 
  onOpenNodeSelector 
}) => {
  const addButton = () => {
    const newButton = {
      label: '',
      description: '',
      imageUrl: '',
      nextNodeId: ''
    };
    
    setFormData(prev => ({
      ...prev,
      buttons: [...(prev.buttons || []), newButton] // Changed from listButtons to buttons
    }));
  };

  const updateButton = (buttonIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons?.map((button, index) =>
        index === buttonIndex ? { ...button, [field]: value } : button
      )
    }));
  };

  const removeButton = (buttonIndex) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons?.filter((_, index) => index !== buttonIndex)
    }));
  };

  // Media upload handlers
  const handleMediaUploaded = (fileData, fieldName) => {
    console.log('📁 Media uploaded for list message:', fieldName, fileData);
    setFormData(prev => ({
      ...prev,
      [fieldName]: fileData.url,
      [`${fieldName}FileName`]: fileData.fileName,
      [`${fieldName}FileSize`]: fileData.fileSize,
      [`${fieldName}FileType`]: fileData.fileType
    }));
  };

  const handleMediaRemoved = (fieldName) => {
    console.log('🗑️ Media removed for list message:', fieldName);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive List</h3>
        <p className="text-gray-600 text-sm">Configure your interactive list with up to 10 buttons and optional media</p>
      </div>

      {/* Header Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header Type</label>
        <select 
          value={formData.headerType || 'text'}
          onChange={(e) => setFormData(prev => ({ ...prev, headerType: e.target.value }))}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
      </div>

      {/* Header Media Upload Section */}
      {formData.headerType === 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Header Image</label>
          
          {formData.headerImageUrl ? (
            <FilePreview
              fileUrl={formData.headerImageUrl}
              fileName={formData.headerImageUrlFileName || 'Header Image'}
              fileType={formData.headerImageUrlFileType || 'image/jpeg'}
              fileSize={formData.headerImageUrlFileSize || 0}
              onRemove={() => handleMediaRemoved('headerImageUrl')}
            />
          ) : (
            <FileUploadButton
              onFileUploaded={(fileData) => handleMediaUploaded(fileData, 'headerImageUrl')}
              acceptedTypes=".jpg,.jpeg,.png"
              buttonText="Upload Header Image"
              buttonIcon="Image"
              maxSize={10 * 1024 * 1024} // 10MB
              fileCategory="image"
            />
          )}
          
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Or enter image URL manually:</label>
            <input
              type="url"
              value={formData.headerImageUrl || ''}
              onChange={(e) => handleUrlChange('headerImageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {formData.headerType === 'video' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Header Video</label>
          
          {formData.headerVideoUrl ? (
            <FilePreview
              fileUrl={formData.headerVideoUrl}
              fileName={formData.headerVideoUrlFileName || 'Header Video'}
              fileType={formData.headerVideoUrlFileType || 'video/mp4'}
              fileSize={formData.headerVideoUrlFileSize || 0}
              onRemove={() => handleMediaRemoved('headerVideoUrl')}
            />
          ) : (
            <FileUploadButton
              onFileUploaded={(fileData) => handleMediaUploaded(fileData, 'headerVideoUrl')}
              acceptedTypes="video/*"
              buttonText="Upload Header Video"
              buttonIcon="Video"
              maxSize={50 * 1024 * 1024} // 50MB
              fileCategory="video"
            />
          )}
          
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Or enter video URL manually:</label>
            <input
              type="url"
              value={formData.headerVideoUrl || ''}
              onChange={(e) => handleUrlChange('headerVideoUrl', e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {formData.headerType === 'document' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Header Document</label>
          
          {formData.headerDocumentUrl ? (
            <FilePreview
              fileUrl={formData.headerDocumentUrl}
              fileName={formData.headerDocumentUrlFileName || 'Header Document'}
              fileType={formData.headerDocumentUrlFileType || 'application/pdf'}
              fileSize={formData.headerDocumentUrlFileSize || 0}
              onRemove={() => handleMediaRemoved('headerDocumentUrl')}
            />
          ) : (
            <FileUploadButton
              onFileUploaded={(fileData) => handleMediaUploaded(fileData, 'headerDocumentUrl')}
              acceptedTypes=".pdf,.doc,.docx,.txt"
              buttonText="Upload Header Document"
              buttonIcon="FileText"
              maxSize={25 * 1024 * 1024} // 25MB
              fileCategory="document"
            />
          )}
          
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Or enter document URL manually:</label>
            <input
              type="url"
              value={formData.headerDocumentUrl || ''}
              onChange={(e) => handleUrlChange('headerDocumentUrl', e.target.value)}
              placeholder="https://example.com/document.pdf"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {/* Header Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Header Text</label>
        <input
          type="text"
          value={formData.header || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, header: e.target.value }))}
          placeholder="Enter header text"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
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
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.text || '').length}/1024
        </div>
      </div>

      {/* List Buttons Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Buttons (up to 10)</label>
        <div className="space-y-3">
          {(formData.buttons || []).map((button, buttonIndex) => (
            <div key={buttonIndex} className="space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <input
                  type="text"
                  value={button.label || ''}
                  onChange={(e) => updateButton(buttonIndex, 'label', e.target.value)}
                  placeholder="Enter button text"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                />
                <div className="text-xs text-gray-400 min-w-[40px] text-center">
                  {(button.label || '').length}/20
                </div>
                <button
                  onClick={() => removeButton(buttonIndex)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <Icons.X size={16} />
                </button>
              </div>
              
              {/* Connect to Node Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenNodeSelector(buttonIndex, 'list')}
                  className="flex-1 px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm flex items-center justify-center"
                >
                  <Icons.Link size={14} className="mr-2" />
                  {button.nextNodeId ? `Connected to: ${button.nextNodeId}` : 'Connect to Node'}
                </button>
                {button.nextNodeId && (
                  <button
                    onClick={() => updateButton(buttonIndex, 'nextNodeId', '')}
                    className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <Icons.Unlink size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add List Button */}
          {(!formData.buttons || formData.buttons.length < 10) && (
            <button
              onClick={addButton}
              className="w-full py-2 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-yellow-300 hover:text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center justify-center font-medium text-sm"
            >
              <Icons.Plus size={16} className="mr-2" />
              Add Button
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Footer (optional)</label>
        <input
          type="text"
          value={formData.footer || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, footer: e.target.value }))}
          placeholder="Enter footer text"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {(formData.footer || '').length}/60
        </div>
      </div>
    </div>
  );
};

export default ListEditor;