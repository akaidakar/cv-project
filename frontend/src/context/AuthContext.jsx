import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (authToken) => {
    try {
      const response = await api.get('dj-rest-auth/user/');
      const userData = response.data;
      console.log('Fetched user data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('dj-rest-auth/login/', { username, password });
      const newToken = response.data.key;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      console.log('Login successful. Token:', newToken, 'isAuthenticated:', true);
      await fetchUserData(newToken);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/dj-rest-auth/registration/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password1: password, password2: password }),
      });

      // Check if the response status is in the successful range (200-299)
      if (response.ok) {
        // Try to parse the response as JSON
        try {
          const data = await response.json();
          const newToken = data.key;
          if (newToken) {
            localStorage.setItem('token', newToken);
            setToken(newToken);
            await fetchUserData();
          }
        } catch (jsonError) {
          console.log('Response is not JSON, but registration was successful');
        }
        return true;
      } else {
        // Handle error responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          const errorMessages = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          throw new Error(errorMessages || 'Registration failed');
        } else {
          const textData = await response.text();
          console.error('Received non-JSON error response:', textData);
          throw new Error('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  console.log('AuthContext state:', { isAuthenticated, token, user, loading });

  useEffect(() => {
    console.log('AuthContext - Current state:', { isAuthenticated, token });
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token]);

  const value = {
    user,
    loading,
    login,
    logout,
    register, // Make sure register is included here
    isAuthenticated: !!token,
  };

  console.log('AuthContext value:', value); // Add this line

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };