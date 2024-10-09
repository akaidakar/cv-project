import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import CommentSection from '../components/CommentSection';
import AISummary from '../components/AISummary';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const PremiumBlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`premium/${id}/`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching premium post:', err);
        if (err.response && err.response.status === 403) {
          setError('subscription_required');
        } else if (err.response && err.response.status === 404) {
          navigate('/premium', { replace: true });
        } else {
          setError('Failed to load post. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/edit-premium-post/${id}`);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`premium/${id}/`);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      navigate('/premium');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error === 'subscription_required') {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
        <p className="mb-4">You need a subscription to access this premium post.</p>
        <Button onClick={() => navigate('/subscription')}>
          Get Subscription
        </Button>
      </div>
    );
  }
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
          <p className="text-sm mt-4">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
        </CardContent>
        {user && user.username === post.author && (
          <CardFooter>
            <Button onClick={handleEdit} className="mr-2">Edit</Button>
            <Button onClick={handleDeleteClick} variant="destructive">Delete</Button>
          </CardFooter>
        )}
      </Card>
      
      <AISummary content={post.content} />
      
      <CommentSection postId={id} isPremium={true} />
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
};

export default PremiumBlogPostPage;