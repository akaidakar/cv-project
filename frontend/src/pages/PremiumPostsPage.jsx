import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';

export default function PremiumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPremiumPosts();
  }, []);

  const fetchPremiumPosts = async () => {
    try {
      const response = await fetch('/api/v1/premium');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.status === 403) {
        console.log('403 error detected');
        setError('subscription_required');
      } else if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`Failed to fetch premium posts: ${response.status}`);
      } else {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error === 'subscription_required') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
        <p className="mb-4">You can read premium blog posts if you buy a subscription.</p>
        <Button onClick={() => {/* Navigate to subscription page */}}>
          Get Subscription
        </Button>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Premium Posts</h2>
      {/* Render your premium posts here */}
      {posts.map(post => (
        <div key={post.id}>{/* Render post content */}</div>
      ))}
    </div>
  );
}