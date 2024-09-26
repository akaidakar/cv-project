import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rawResponse, setRawResponse] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/posts'); // Adjust the URL and port as needed
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const rawData = await response.text();
        setRawResponse(rawData);
        console.log('Raw response:', rawData.substring(0, 500)); // Log first 500 characters
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Attempt to parse JSON only if the content type is application/json
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = JSON.parse(rawData);
          setPosts(data);
        } else {
          throw new Error('Response is not JSON');
        }
      } catch (error) {
        console.error('Error in getPosts:', error);
        setError(`Failed to load posts. Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    getPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div>
      <p>{error}</p>
      <h2>Raw Response:</h2>
      <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{rawResponse}</pre>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.body}</p>
              <p className="text-sm mt-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostList;