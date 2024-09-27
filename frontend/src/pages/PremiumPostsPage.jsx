import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import api from '../api';

export default function PremiumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(null);

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

  const handleUpdate = async (id) => {
    try {
      const response = await api.put(`premium/${id}/`, editingPost);
      setPosts(posts.map(post => post.id === id ? response.data : post));
      setEditingPost(null);
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`premium/${id}/`);
      setPosts(posts.filter(post => post.id !== id));
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
      
      <Button onClick={() => navigate('/create-premium-post')} className="mb-6">Create New Premium Post</Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {editingPost && editingPost.id === post.id ? (
                <>
                  <Input
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    className="mb-2"
                  />
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    className="w-full p-2 border rounded mb-2"
                  />
                </>
              ) : (
                <p>{post.content}</p>
              )}
              <p className="text-sm mt-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
            </CardContent>
            {user && user.username === post.author && (
              <CardFooter>
                {editingPost && editingPost.id === post.id ? (
                  <Button onClick={() => handleUpdate(post.id)}>Save</Button>
                ) : (
                  <Button onClick={() => setEditingPost(post)}>Edit</Button>
                )}
                <Button onClick={() => handleDelete(post.id)} variant="destructive" className="ml-2">Delete</Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}