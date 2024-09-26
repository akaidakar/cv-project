import React, { createContext, useState, useContext, useEffect } from 'react';

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
      const response = await fetch('http://localhost:8000/api/v1/dj-rest-auth/user/', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        setUser(userData);
      } else {
        console.log('Failed to fetch user data');
        logout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/dj-rest-auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const newToken = data.key;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      await fetchUserData(newToken);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  console.log('AuthContext state:', { isAuthenticated, token, user, loading });

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };