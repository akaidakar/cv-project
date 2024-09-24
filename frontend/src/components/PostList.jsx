import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../postService';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    getPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;