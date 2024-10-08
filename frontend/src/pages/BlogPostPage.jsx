import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import CommentSection from '../components/CommentSection';
import AISummary from '../components/AISummary';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      </Card>
      
      <AISummary content={post.content} />
      
      <CommentSection postId={id} isPremium={false} />
    </div>
  );
};

export default BlogPostPage;