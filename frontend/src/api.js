import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ensure the token key matches
  console.log('API interceptor - Request URL:', config.url);
  console.log('API interceptor - Token from localStorage:', token);
  if (token) {
    // Remove any quotes around the token if present
    const cleanToken = token.replace(/^["'](.+(?=["']$))["']$/, '$1');
    config.headers.Authorization = `Token ${cleanToken}`;
  }
  console.log('API interceptor - Final headers:', config.headers);
  console.log('API interceptor - request URL:', config.url);
  return config;
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API error:', error.config.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;