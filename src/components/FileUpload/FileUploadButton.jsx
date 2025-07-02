import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { s3UploadService } from '../../services/s3Upload';

const FileUploadButton = ({ 
  onFileUploaded, 
  acceptedTypes = "image/*,video/*,.pdf,.doc,.docx,.txt",
  maxSize = 50 * 1024 * 1024, // 50MB
  buttonText = "Upload File",
  buttonIcon = "Upload",
  disabled = false,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File selected:', { name: file.name, type: file.type, size: file.size });

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Upload file to S3
      const result = await s3UploadService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      console.log('✅ Upload successful:', result);

      // Notify parent component
      if (onFileUploaded) {
        onFileUploaded({
          url: result.url,
          fileName: result.fileName,
          fileSize: result.fileSize,
          fileType: result.fileType,
          category: s3UploadService.getFileCategory(result.fileType)
        });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
        disabled={disabled || uploading}
      />
      
      <button
        onClick={handleFileSelect}
        disabled={disabled || uploading}
        className={`w-full px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
          uploading 
            ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
            : error
            ? 'border-red-300 bg-red-50 hover:border-red-400'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {uploading ? (
          <>
            <div className="relative w-8 h-8">
              <Icons.Loader2 size={24} className="text-blue-600 animate-spin" />
            </div>
            <div className="text-sm font-medium text-blue-700">
              Uploading... {uploadProgress}%
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </>
        ) : error ? (
          <>
            <Icons.AlertCircle size={24} className="text-red-600" />
            <div className="text-sm font-medium text-red-700">Upload Failed</div>
            <div className="text-xs text-red-600 text-center px-2">{error}</div>
          </>
        ) : (
          <>
            <ButtonIcon size={24} className="text-gray-600" />
            <div className="text-sm font-medium text-gray-700">{buttonText}</div>
            <div className="text-xs text-gray-500">
              Max {s3UploadService.formatFileSize(maxSize)}
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default FileUploadButton;