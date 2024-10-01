import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionSuccessPage() {
  const { fetchUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updateUserData = async () => {
      await fetchUserData();
      setTimeout(() => navigate('/'), 5000);
    };

    updateUserData();
  }, [fetchUserData, navigate]);

  return (
    <div>
      <h1>Subscription Successful!</h1>
      <p>Thank you for subscribing. You will be redirected to the home page shortly.</p>
    </div>
  );
}