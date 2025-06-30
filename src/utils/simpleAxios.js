import axios from 'axios';

// Simple axios instance
const simpleAxios = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Example API for testing
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple request interceptor
simpleAxios.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Simple response interceptor
simpleAxios.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.message);
    return Promise.reject(error);
  }
);

// Simple API functions
export const simpleAPI = {
  // Get all posts
  getPosts: async () => {
    try {
      const response = await simpleAxios.get('/posts');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch posts');
    }
  },

  // Get single post
  getPost: async (id) => {
    try {
      const response = await simpleAxios.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch post');
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await simpleAxios.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create post');
    }
  },

  // Update post
  updatePost: async (id, postData) => {
    try {
      const response = await simpleAxios.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update post');
    }
  },

  // Delete post
  deletePost: async (id) => {
    try {
      const response = await simpleAxios.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete post');
    }
  }
};

export default simpleAxios;