import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';

const FileUploadButton = ({ 
  onFileUploaded, 
  acceptedTypes = "image/*,video/*,.pdf,.doc,.docx,.txt",
  maxSize = 50 * 1024 * 1024, // 50MB
  buttonText = "Upload File",
  buttonIcon = "Upload",
  disabled = false,
  className = "",
  fileCategory = "image" // 'image', 'video', 'document'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  const {
    isUploading,
    progress,
    error,
    uploadFile,
    clearError,
    formatFileSize
  } = useFileUpload();

  const handleFileSelect = () => {
    clearError();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = async (file) => {
    console.log('📁 File selected:', { name: file.name, type: file.type, size: file.size });

    try {
      const result = await uploadFile(file, {
        fileType: fileCategory,
        onProgress: (progress) => {
          console.log(`📊 Upload progress: ${progress}%`);
        }
      });

      console.log('✅ Upload successful:', result);

      // Notify parent component
      if (onFileUploaded) {
        onFileUploaded(result);
      }

    } catch (err) {
      console.error('❌ Upload failed:', err);
      // Error is already handled by the hook
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const ButtonIcon = Icons[buttonIcon] || Icons.Upload;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      <div
        onClick={handleFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
          dragOver
            ? 'border-blue-400 bg-blue-100'
            : isUploading 
            ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
            : error
            ? 'border-red-300 bg-red-50 hover:border-red-400'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUploading ? (
          <>
            <div className="relative w-8 h-8">
              <Icons.Loader2 size={24} className="text-blue-600 animate-spin" />
            </div>
            <div className="text-sm font-medium text-blue-700">
              Uploading... {progress}%
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : error ? (
          <>
            <Icons.AlertCircle size={24} className="text-red-600" />
            <div className="text-sm font-medium text-red-700">Upload Failed</div>
            <div className="text-xs text-red-600 text-center px-2">{error}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearError();
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <ButtonIcon size={24} className={dragOver ? "text-blue-600" : "text-gray-600"} />
            <div className={`text-sm font-medium ${dragOver ? "text-blue-700" : "text-gray-700"}`}>
              {dragOver ? "Drop file here" : buttonText}
            </div>
            <div className="text-xs text-gray-500">
              {dragOver ? "Release to upload" : `Max ${formatFileSize(maxSize)} • Drag & drop or click`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploadButton;