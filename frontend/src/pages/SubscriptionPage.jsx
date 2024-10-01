import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import api from '../api';
import stripePromise from '../stripe';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await api.post('create-checkout-session/', {
        price_id: 'price_your_subscription_price_id', // Make sure this is your actual Stripe Price ID
      });
      
      // Redirect to Stripe Checkout
      const { id: sessionId } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        toast({
          title: "Error",
          description: "Failed to redirect to checkout. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Premium Subscription</CardTitle>
        <CardDescription>Get access to exclusive content for just $2.99/month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Unlock premium features and content with our monthly subscription.
        </p>
        {user.is_premium ? (
          <p className="text-green-600 font-semibold">You are already a premium subscriber!</p>
        ) : (
          <Button onClick={handleSubscribe} disabled={loading} className="w-full">
            {loading ? 'Processing...' : 'Subscribe Now'}
          </Button>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-400">
          By subscribing, you agree to our terms of service and privacy policy.
        </p>
      </CardFooter>
    </Card>
  );
}