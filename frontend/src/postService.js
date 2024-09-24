import api from './api';

export const fetchPosts = async () => {
  try {
    const response = await api.get('posts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPremiumPosts = async () => {
  try {
    const response = await api.get('premium/');
    console.log('Premium posts API response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching premium posts:', error);
    throw error;
  }
};