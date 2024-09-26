import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the context
const UserContext = createContext(null);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await fetch('http://localhost:8000/api/v1/dj-rest-auth/user/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };