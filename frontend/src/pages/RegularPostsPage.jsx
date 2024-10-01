import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import api from '../api';

export default function RegularPostsPage() {
  console.log('RegularPostsPage component rendering');

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('RegularPostsPage useEffect triggered');
    fetchPosts();
  }, [])

  const fetchPosts = async () => {
    console.log('fetchPosts function called');
    try {
      const response = await api.get('posts/');
      console.log('Posts API response:', response);
      if (response && response.data) {
        console.log('Setting posts:', response.data);
        setPosts(response.data);
      } else {
        console.error('Invalid response from server');
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  console.log('Current posts state:', posts);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Regular Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => {
          console.log('Rendering post:', post);
          return (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {post.content || 'No content available'}
                </p>
                <p className="text-sm">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}