// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1/', // Ensure this matches your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ensure the token key matches
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

export default api;