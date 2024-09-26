import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children, requirePremium = false }) => {
  const { isAuthenticated, token } = useAuth();
  const { user } = useUser();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  if (requirePremium) {
    const isPremium = user?.subscription === undefined || user?.subscription === 'premium';
    if (!isPremium) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
