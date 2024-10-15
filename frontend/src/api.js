import axios from 'axios';

const isDevelopment = import.meta.env.MODE === "development";
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY;

console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_BASE_URL_LOCAL:', import.meta.env.VITE_API_BASE_URL_LOCAL);
console.log('VITE_API_BASE_URL_DEPLOY:', import.meta.env.VITE_API_BASE_URL_DEPLOY);
console.log('Current baseURL:', myBaseUrl);

const baseURL = myBaseUrl;
console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    console.log('API interceptor - Request URL:', config.url);
    
    if (!config.url.includes('dj-rest-auth/login/') && !config.url.includes('dj-rest-auth/registration/')) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
    } else {
      // Remove Authorization header for dj-rest-auth requests
      delete config.headers['Authorization'];
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
    console.log('API Response:', response.config.method.toUpperCase(), response.config.url, response.status, response.headers, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.config?.method.toUpperCase(), error.config?.url, error.response?.status, error.response?.headers, error.response?.data);
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
