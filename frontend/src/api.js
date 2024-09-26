import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ensure the token key matches
  console.log('Token from localStorage:', token); // Add this line
  if (token) {
    // Remove any quotes around the token if present
    const cleanToken = token.replace(/^["'](.+(?=["']$))["']$/, '$1');
    config.headers.Authorization = `Token ${cleanToken}`;
  }
  return config;
});

export default api;