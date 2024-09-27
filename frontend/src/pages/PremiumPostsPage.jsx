import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom'; // Add this import

export default function PremiumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPremiumPosts();
  }, []);

  const fetchPremiumPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/premium/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 403) {
        setError('subscription_required');
      } else if (!response.ok) {
        throw new Error(`Failed to fetch premium posts: ${response.status}`);
      } else {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
        <Button onClick={() => navigate('/subscription')}>
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
        <div key={post.id} className="mb-4">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}