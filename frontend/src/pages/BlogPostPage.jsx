import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import CommentSection from '../components/CommentSection';
import AISummary from '../components/AISummary';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const BlogPostPage = () => {
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
        const response = await api.get(`posts/${id}/`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
        if (err.response && err.response.status === 404) {
          navigate('/posts', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!post) return null;

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`posts/${id}/`);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      navigate('/posts');
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
          <div className="p-4 border-t"> {/* Replace CardFooter with this */}
            <Button onClick={() => navigate(`/edit-post/${id}`)} className="mr-2">Edit</Button>
            <Button onClick={handleDeleteClick} variant="destructive">Delete</Button>
          </div>
        )}
      </Card>
      
      <AISummary content={post.content} />
      
      <CommentSection postId={id} isPremium={false} />
      
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

export default BlogPostPage;