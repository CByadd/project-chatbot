import { useState, useCallback, useRef } from 'react';
import {BASE_URL} from './../services/api';
/**
 * Custom hook for handling file uploads with S3 integration
 * Provides upload state management, progress tracking, and error handling
 */
export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedFiles: new Map() // Track multiple uploads by ID
  });

  const abortControllerRef = useRef(null);

  // File validation configuration
  const FILE_CONFIGS = {
    image: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      category: 'image'
    },
    video: {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
      category: 'video'
    },
    document: {
      maxSize: 25 * 1024 * 1024, // 25MB
      allowedTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ],
      category: 'document'
    }
  };

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file, fileType = 'image') => {
    const config = FILE_CONFIGS[fileType];
    
    if (!config) {
      throw new Error(`Unsupported file type category: ${fileType}`);
    }

    // Check file size
    if (file.size > config.maxSize) {
      const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
      throw new Error(`File size too large. Maximum size is ${maxSizeMB}MB`);
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
      throw new Error(`File type not supported: ${file.type}`);
    }

    console.log('✅ File validation passed:', { 
      name: file.name, 
      type: file.type, 
      size: file.size,
      category: fileType
    });

    return true;
  }, []);

  /**
   * Generate unique filename with timestamp and random string
   */
  const generateUniqueFileName = useCallback((originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${fileExtension}`;
  }, []);

  /**
   * Get signed URL from server
   */
  const getSignedUrl = useCallback(async (fileName, fileType, fileSize) => {
    try {
      console.log('🔗 Requesting signed URL:', { fileName, fileType, fileSize });
      
      // TODO: Replace with your actual API endpoint
      const apiUrl = BASE_URL;
      
      const response = await fetch(`${apiUrl}/upload/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          fileType,
          fileSize
        }),
        signal: abortControllerRef.current?.signal
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Signed URL received:', data);
      
      return {
        signedUrl: data.signedUrl,
        fileUrl: data.fileUrl
      };
    } catch (error) {
      console.error('❌ Failed to get signed URL:', error);
      throw new Error(`Failed to get upload URL: ${error.message}`);
    }
  }, []);

  /**
   * Upload file to S3 using signed URL
   */
  const uploadToS3 = useCallback(async (signedUrl, file, onProgress) => {
    try {
      console.log('📤 Uploading to S3:', { fileName: file.name, size: file.size });
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded * 100) / event.total);
            onProgress(progress);
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('✅ S3 upload completed:', xhr.status);
            resolve(xhr);
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        // Handle abort
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was cancelled'));
        });

        // Store reference for potential cancellation
        if (abortControllerRef.current) {
          abortControllerRef.current.signal.addEventListener('abort', () => {
            xhr.abort();
          });
        }

        // Start upload
        xhr.open('PUT', signedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error('❌ S3 upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }, []);

  /**
   * Main upload function
   */
  const uploadFile = useCallback(async (file, options = {}) => {
  const {
    fileType = 'image',
    onProgress,
    uploadId = Date.now().toString()
  } = options;

  abortControllerRef.current = new AbortController();

  setUploadState(prev => ({
    ...prev,
    isUploading: true,
    progress: 0,
    error: null
  }));

  try {
    validateFile(file, fileType);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      signal: abortControllerRef.current.signal,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const { fileUrl } = await response.json();

    const result = {
      id: uploadId,
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      category: fileType,
      uploadedAt: new Date().toISOString()
    };

    setUploadState(prev => ({
      ...prev,
      isUploading: false,
      progress: 100,
      uploadedFiles: new Map(prev.uploadedFiles.set(uploadId, result))
    }));

    return result;

  } catch (error) {
    console.error('❌ Upload process failed:', error);

    setUploadState(prev => ({
      ...prev,
      isUploading: false,
      progress: 0,
      error: error.message
    }));

    throw error;
  } finally {
    abortControllerRef.current = null;
  }
}, [validateFile]);

  /**
   * Upload multiple files
   */
  const uploadMultipleFiles = useCallback(async (files, options = {}) => {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i], {
          ...options,
          uploadId: `${Date.now()}_${i}`
        });
        results.push(result);
      } catch (error) {
        errors.push({ file: files[i], error: error.message });
      }
    }

    return { results, errors };
  }, [uploadFile]);

  /**
   * Cancel current upload
   */
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('🚫 Upload cancelled by user');
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: 'Upload cancelled'
      }));
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setUploadState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  /**
   * Remove uploaded file from state
   */
  const removeUploadedFile = useCallback((uploadId) => {
    setUploadState(prev => {
      const newUploadedFiles = new Map(prev.uploadedFiles);
      newUploadedFiles.delete(uploadId);
      return {
        ...prev,
        uploadedFiles: newUploadedFiles
      };
    });
  }, []);

  /**
   * Get file category from MIME type
   */
  const getFileCategory = useCallback((mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  }, []);

  /**
   * Format file size for display
   */
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  /**
   * Check if file type is supported
   */
  const isFileTypeSupported = useCallback((file, category = 'image') => {
    const config = FILE_CONFIGS[category];
    return config && config.allowedTypes.includes(file.type);
  }, []);

  return {
    // State
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    error: uploadState.error,
    uploadedFiles: uploadState.uploadedFiles,

    // Actions
    uploadFile,
    uploadMultipleFiles,
    cancelUpload,
    clearError,
    removeUploadedFile,

    // Utilities
    validateFile,
    getFileCategory,
    formatFileSize,
    isFileTypeSupported,
    
    // Configuration
    FILE_CONFIGS
  };
};

export default useFileUpload;