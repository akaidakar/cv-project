import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link } from 'react-router-dom';
import api from '../api';  // Import the api instance

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('posts/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      setError(`Failed to load posts. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await api.put(`posts/${id}/`, editingPost);
      setPosts(posts.map(post => post.id === id ? response.data : post));
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`posts/${id}/`);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      
      <Link to="/create-post">
        <Button className="mb-6">Create New Post</Button>
      </Link>

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
                    value={editingPost.body}
                    onChange={(e) => setEditingPost({...editingPost, body: e.target.value})}
                    className="w-full p-2 border rounded mb-2"
                  />
                </>
              ) : (
                <p>{post.body}</p>
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
};

export default PostList;