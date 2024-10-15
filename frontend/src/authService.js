// src/authService.js
import api from './api';

export const userLogin = async (username, password) => {
  console.log('userLogin function called with:', { username, password });
  try {
    const response = await api.post('dj-rest-auth/login/', { username, password });
    console.log('Login response:', response.data);
    localStorage.setItem('token', response.data.key);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    console.error('Full error object:', error);
    throw error;
  }
};

export const register = async (username, email, password1, password2) => {
  try {
    const response = await api.post('dj-rest-auth/registration/', { username, email, password1, password2 });
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('dj-rest-auth/logout/');
    console.log('Logout response:', response.data);
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserData = async () => {
  try {
    const response = await api.get('dj-rest-auth/user/');
    console.log('User data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    throw error;
  }
};

console.log('authService loaded');
