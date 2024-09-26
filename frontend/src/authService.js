// src/authService.js
import api from './api';

export const userLogin = async (username, password) => {
  console.log('userLogin function called'); // Debug log
  // Your login logic here
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  // You might want to save the token in localStorage here
  localStorage.setItem('token', data.token);
  return data;
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

console.log('authService loaded, userLogin:', userLogin);