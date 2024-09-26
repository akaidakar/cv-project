import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ensure the token key matches
  if (token) {
    config.headers.Authorization = `Token ${JSON.parse(token)}`;
  }
  return config;
});

export default api;