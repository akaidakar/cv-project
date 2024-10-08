import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('posts/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      setError(`Failed to load posts. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      
      <Link to="/create-post">
        <Button className="mb-6">Create New Post</Button>
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
    </div>
  );
};

export default PostList;