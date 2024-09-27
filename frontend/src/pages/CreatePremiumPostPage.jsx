import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import api from '../api';

const CreatePremiumPostPage = () => {
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreate = async () => {
    try {
      const response = await api.post('premium/', newPost);
      console.log('Created premium post:', response.data);
      toast({
        title: "Success",
        description: "Premium post created successfully",
      });
      navigate('/premium');
    } catch (error) {
      console.error('Error creating premium post:', error.response?.data || error.message);
      toast({
        title: "Error",
        description: "Failed to create premium post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Premium Post</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Premium Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            className="mb-4"
          />
          <textarea
            placeholder="Content"
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            className="w-full p-2 border rounded mb-4"
            rows={5}
          />
          <Button onClick={handleCreate}>Create Premium Post</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePremiumPostPage;