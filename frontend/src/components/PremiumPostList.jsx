import React, { useEffect, useState } from 'react';
import { fetchPremiumPosts } from '../postService';

const PremiumPostList = () => {
  const [premiumPosts, setPremiumPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPremiumPosts = async () => {
      try {
        const data = await fetchPremiumPosts();
        setPremiumPosts(data);
      } catch (error) {
        setError('Failed to load premium posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    getPremiumPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-4">Loading premium posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Premium Posts</h1>
      <ul>
        {premiumPosts.map((post) => (
          <li key={post.id}>
            <h2>{post.blog_post?.title || post.title || 'Untitled Post'}</h2>
            <p>{post.premium_content || post.body || 'No content available'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PremiumPostList;