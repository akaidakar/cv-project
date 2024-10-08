import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',  // Remove 'v1/' from here
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    const token = localStorage.getItem('token');
    console.log('API interceptor - Request URL:', config.url);
    console.log('API interceptor - Token from localStorage:', token);
    if (token) {
      // Remove any quotes around the token if present
      const cleanToken = token.replace(/^["'](.+(?=["']$))["']$/, '$1');
      config.headers['Authorization'] = `Token ${cleanToken}`;
    }
    console.log('API interceptor - Final headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (keep as is)
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method.toUpperCase(), response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.config?.method.toUpperCase(), error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Explicitly define the post method
api.post = (url, data, config) => api.request({
  ...config,
  method: 'post',
  url,
  data,
});

export default api;