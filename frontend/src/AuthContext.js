// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, logout } from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setAuthToken(token);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = async (username, password) => {
    const data = await login(username, password);
    localStorage.setItem('authToken', data.key);
    localStorage.setItem('username', username);
    setAuthToken(data.key);
    setUsername(username);
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setAuthToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, username, setAuthToken, setUsername, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);