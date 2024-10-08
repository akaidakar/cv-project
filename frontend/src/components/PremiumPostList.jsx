import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'; // Add Card components
import { motion, AnimatePresence } from 'framer-motion'; // Add framer-motion

export default function PremiumPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchPremiumPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

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
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        console.log('Fetched premium posts:', data);
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching premium posts:', error);
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

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access premium content.</div>;
  }

  if (error === 'subscription_required') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
        <p className="mb-4">You don't have premium access. You can read premium blog posts if you buy a subscription.</p>
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
      <h2 className="text-3xl font-bold mb-6">Premium Posts</h2>
      {posts.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card 
                  className="h-full cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => handlePostClick(post.id)}
                >
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">{post.content}</p>
                    <p className="text-sm mt-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p>No premium posts available.</p>
      )}
    </div>
  );
}