import axios from 'axios';

// S3 Upload Service
class S3UploadService {
  constructor() {
    this.baseURL = import.meta.env.VITE_REACT_APP_API_URL || 'https://proto-server.onrender.com/api';
  }

  /**
   * Get signed URL for S3 upload
   */
  async getSignedUrl(fileName, fileType, fileSize) {
    try {
      console.log('🔗 Requesting signed URL:', { fileName, fileType, fileSize });
      
      const response = await axios.post(`${this.baseURL}/upload/signed-url`, {
        fileName,
        fileType,
        fileSize
      });

      console.log('✅ Signed URL received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get signed URL:', error);
      throw new Error(`Failed to get upload URL: ${error.message}`);
    }
  }

  /**
   * Upload file directly to S3 using signed URL
   */
  async uploadToS3(signedUrl, file, onProgress) {
    try {
      console.log('📤 Uploading to S3:', { fileName: file.name, size: file.size });
      
      const response = await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });

      console.log('✅ S3 upload completed:', response.status);
      return response;
    } catch (error) {
      console.error('❌ S3 upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Complete upload process: get signed URL + upload to S3
   */
  async uploadFile(file, onProgress) {
    try {
      // Validate file
      this.validateFile(file);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${timestamp}_${randomString}.${fileExtension}`;

      // Get signed URL
      const { signedUrl, fileUrl } = await this.getSignedUrl(
        uniqueFileName,
        file.type,
        file.size
      );

      // Upload to S3
      await this.uploadToS3(signedUrl, file, onProgress);

      console.log('🎉 File upload completed:', { fileUrl, fileName: file.name });
      
      return {
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
    } catch (error) {
      console.error('❌ Upload process failed:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    };

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    const allAllowedTypes = [...allowedTypes.image, ...allowedTypes.video, ...allowedTypes.document];
    if (!allAllowedTypes.includes(file.type)) {
      throw new Error(`File type not supported: ${file.type}`);
    }

    console.log('✅ File validation passed:', { name: file.name, type: file.type, size: file.size });
  }

  /**
   * Get file type category
   */
  getFileCategory(fileType) {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    return 'document';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const s3UploadService = new S3UploadService();
export default s3UploadService;