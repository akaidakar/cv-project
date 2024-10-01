import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to subscription page after a short delay
    const timer = setTimeout(() => navigate('/subscription'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Subscription Cancelled</h1>
      <p>Your subscription was not completed. You will be redirected to the subscription page shortly.</p>
    </div>
  );
}