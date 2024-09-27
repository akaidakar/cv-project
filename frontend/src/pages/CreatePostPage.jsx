import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../api';  // Import the api instance

const CreatePostPage = () => {
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const response = await api.post('posts/', newPost);
      console.log('Created post:', response.data);
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      // You can add user feedback here, e.g., using a toast notification
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            className="mb-4"
          />
          <textarea
            placeholder="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({...newPost, body: e.target.value})}
            className="w-full p-2 border rounded mb-4"
            rows={5}
          />
          <Button onClick={handleCreate}>Create Post</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostPage;