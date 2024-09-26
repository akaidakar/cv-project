import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requirePremium }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requirePremium && !user?.is_premium) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
        <p className="mb-4">You don't have premium access. You can read premium blog posts if you buy a subscription.</p>
        <button onClick={() => {/* Navigate to subscription page */}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Subscription
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
