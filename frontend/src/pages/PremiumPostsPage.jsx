import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

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
      const response = await api.get('premium/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching premium posts:', error);
      setError(error.response?.status === 403 ? 'subscription_required' : error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    navigate(`/edit-premium-post/${post.id}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`premium/${postId}/`);
        setPosts(posts.filter(post => post.id !== postId));
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;

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

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Premium Posts</h1>
      
      <Link to="/create-premium-post">
        <Button className="mb-6">Create New Premium Post</Button>
      </Link>

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
              <Card className="h-full transition-transform duration-300 hover:scale-105">
                <Link to={`/premium/${post.id}`} className="block h-full">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">{post.content}</p>
                    <p className="text-sm mt-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Link>
                {user && user.username === post.author && (
                  <CardFooter>
                    <Button onClick={(e) => { e.preventDefault(); handleEdit(post); }}>Edit</Button>
                    <Button onClick={(e) => { e.preventDefault(); handleDelete(post.id); }} variant="destructive" className="ml-2">Delete</Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}