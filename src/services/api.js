import axios from 'axios';

// Base URL configuration
// const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://proto-server.onrender.com/api';
// const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:4000/api';
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Flow API endpoints
export const flowAPI = {
  // POST /api/flows - Create new flow
  createFlow: async (flowData) => {
    const response = await api.post('/flows', flowData);
    return response.data;
  },

  // PUT /api/flows/:id - Update flow
  updateFlow: async (flowId, flowData) => {
    const response = await api.put(`/flows/${flowId}`, flowData);
    return response.data;
  },

  // GET /api/flows/:id - Get single flow
  getFlow: async (flowId) => {
    const response = await api.get(`/flows/${flowId}`);
    return response.data;
  },

  // GET /api/flows - Get all flows
  getFlows: async () => {
    const response = await api.get('/flows');
    return response.data;
  },

  // DELETE /api/flows/:id - Delete flow
  deleteFlow: async (flowId) => {
    const response = await api.delete(`/flows/${flowId}`);
    return response.data;
  },

  // POST /api/flows/:id/publish - Publish flow
  publishFlow: async (flowId) => {
    const response = await api.post(`/flows/${flowId}/publish`);
    return response.data;
  },

  // POST /api/flows/:id/unpublish - Unpublish flow
  unpublishFlow: async (flowId) => {
    const response = await api.post(`/flows/${flowId}/unpublish`);
    return response.data;
  }
};

// Export base URL and axios instance
export { BASE_URL };
export default api;