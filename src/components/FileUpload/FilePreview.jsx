import React from 'react';
import * as Icons from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';

const FilePreview = ({ 
  fileUrl, 
  fileName, 
  fileType, 
  fileSize,
  onRemove,
  className = "",
  showActions = true
}) => {
  const { getFileCategory, formatFileSize } = useFileUpload();

  if (!fileUrl) return null;

  const category = getFileCategory(fileType);
  const formattedSize = formatFileSize(fileSize || 0);

  const renderPreview = () => {
    switch (category) {
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={fileUrl} 
              alt={fileName}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-32 bg-gray-100 rounded-lg border border-gray-200 items-center justify-center">
              <div className="text-center">
                <Icons.ImageOff size={24} className="text-gray-400 mx-auto mb-2" />
                <div className="text-xs text-gray-500">Failed to load image</div>
              </div>
            </div>
            {showActions && onRemove && (
              <button
                onClick={onRemove}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove file"
              >
                <Icons.X size={12} />
              </button>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="relative group">
            <video 
              src={fileUrl}
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
              controls={false}
              muted
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-32 bg-gray-100 rounded-lg border border-gray-200 items-center justify-center">
              <div className="text-center">
                <Icons.VideoOff size={24} className="text-gray-400 mx-auto mb-2" />
                <div className="text-xs text-gray-500">Failed to load video</div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <Icons.Play size={20} className="text-white ml-1" />
              </div>
            </div>
            {showActions && onRemove && (
              <button
                onClick={onRemove}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove file"
              >
                <Icons.X size={12} />
              </button>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="relative group">
            <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-4">
              <Icons.FileText size={32} className="text-gray-400 mb-2" />
              <div className="text-xs text-gray-600 text-center font-medium truncate w-full">
                {fileName}
              </div>
              <div className="text-xs text-gray-500 mt-1">{formattedSize}</div>
            </div>
            {showActions && onRemove && (
              <button
                onClick={onRemove}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove file"
              >
                <Icons.X size={12} />
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {renderPreview()}
      
      {/* File Info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Icons.Paperclip size={12} />
          <span className="truncate max-w-[120px]" title={fileName}>{fileName}</span>
        </div>
        <span>{formattedSize}</span>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <Icons.ExternalLink size={12} className="mr-1" />
            View
          </a>
          {onRemove && (
            <button
              onClick={onRemove}
              className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100 transition-colors flex items-center"
            >
              <Icons.Trash2 size={12} className="mr-1" />
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilePreview;