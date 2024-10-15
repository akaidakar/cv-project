import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import PostCard from './PostCard';
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
      console.log('API Response:', response); // Log the entire response
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setError('Received unexpected data format from the server');
      }
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      setError(`Failed to load posts. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post) => {
    navigate(`/edit-post/${post.id}`);
  };

  const handleDelete = async (postId) => {
    const postToDelete = posts.find(post => post.id === postId);
    console.log('Current user:', user);
    console.log('Post author:', postToDelete.author);
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`posts/${postId}/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setPosts(posts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        if (error.response && error.response.status === 403) {
          setError("You don't have permission to delete this post.");
        } else {
          setError(`Failed to delete post. Error: ${error.message}`);
        }
      }
    }
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
              <PostCard 
                post={post}
                onEdit={() => handleEdit(post)}
                onDelete={() => handleDelete(post.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PostList;
