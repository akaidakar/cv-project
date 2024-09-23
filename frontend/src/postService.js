import api from './api';

export const fetchPosts = async () => {
  const response = await api.get('posts/');
  return response.data;
};