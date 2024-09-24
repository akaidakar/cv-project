// src/authService.js
import api from './api';

export const login = async (username, password) => {
  const response = await api.post('dj-rest-auth/login/', { username, password });
  const token = response.data.key;

  // Fetch user details
  const userResponse = await api.get('dj-rest-auth/user/', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });

  return { token, user: userResponse.data };
};

export const register = async (username, email, password1, password2) => {
  const response = await api.post('dj-rest-auth/registration/', { username, email, password1, password2 });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('dj-rest-auth/logout/');
  return response.data;
};

// Add other functions as needed, e.g., password reset, user details, etc.