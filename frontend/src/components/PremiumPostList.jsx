import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';

export default function PremiumPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPremiumPosts();
  }, []);

  const fetchPremiumPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/premium/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched premium posts:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching premium posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  console.log('Current user:', user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || user.subscription !== 'premium') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
        <p className="mb-4">You can read premium blog posts if you buy a subscription.</p>
        <Button onClick={() => {/* Navigate to subscription page */}}>
          Get Subscription
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Premium Posts</h2>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="mb-4">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p>{post.body}</p>
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <h4 className="font-semibold">Premium Content:</h4>
              <p>{post.premium_content}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No premium posts available.</p>
      )}
    </div>
  );
}