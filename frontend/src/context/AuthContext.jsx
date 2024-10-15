import React, { createContext, useState, useContext, useEffect } from 'react';
import { userLogin, register as authRegister, logout as authLogout, fetchUserData as authFetchUserData } from '../authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userData = await authFetchUserData();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchUserData();
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await userLogin(username, password);
      setToken(data.key);
      setIsAuthenticated(true);
      await fetchUserData();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await authRegister(username, email, password, password);
      setToken(data.key);
      setIsAuthenticated(true);
      await fetchUserData();
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated,
    fetchUserData,
  };

  console.log('AuthContext value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
