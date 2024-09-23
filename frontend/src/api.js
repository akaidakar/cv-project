// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', // Adjust the baseURL to match your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;