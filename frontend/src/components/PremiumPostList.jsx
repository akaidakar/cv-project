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
        console.log('Fetched premium posts:', data); // Debug log
        setPremiumPosts(data);
      } catch (error) {
        console.error('Error fetching premium posts:', error);
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
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Premium Posts</h1>
      {premiumPosts.length === 0 ? (
        <p className="text-center">No premium posts available.</p>
      ) : (
        <ul className="space-y-4">
          {premiumPosts.map((post) => (
            <li key={post.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">
                {post.blog_post?.title || post.title || 'Untitled Post'}
              </h2>
              <p className="text-gray-600">
                {post.premium_content || post.body || 'No content available'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PremiumPostList;