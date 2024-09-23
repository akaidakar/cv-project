// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, logout } from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleLogin = async (username, password) => {
    const data = await login(username, password);
    localStorage.setItem('authToken', data.key);
    setAuthToken(data.key);
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);