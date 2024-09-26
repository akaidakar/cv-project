import api from './api.js';  // Add the .js extension
import axios from 'axios';

export const fetchPosts = async () => {
  try {
    const response = await api.get('posts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error.response || error);
    throw error;
  }
};

export const fetchPremiumPosts = async () => {
  const response = await axios.get('http://localhost:8000/api/premium-posts/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}` // or however you're storing the token
    }
  });
  return response.data;
};