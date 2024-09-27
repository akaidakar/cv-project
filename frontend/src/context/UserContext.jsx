import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';

// Create the context
const UserContext = createContext(null);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Attempting to fetch user data. isAuthenticated:', isAuthenticated, 'token:', token);
      if (isAuthenticated && token) {
        try {
          // Add a small delay to ensure the token is fully set
          await new Promise(resolve => setTimeout(resolve, 500));
          const response = await api.get('dj-rest-auth/user/');
          console.log('User data response:', response.data);
          setUser(response.data);
          console.log('User data set in state:', response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        console.log('Not authenticated or no token, skipping user data fetch');
      }
    };

    fetchUserData();
  }, [isAuthenticated, token]);

  console.log('UserContext render - Current user:', user);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };