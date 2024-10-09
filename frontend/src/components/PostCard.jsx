import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onEdit, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`);
  };

  return (
    <Card className="h-full transition-transform duration-300 hover:scale-105">
      <Link to={`/posts/${post.id}`} className="block h-full">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3">{post.content}</p>
          <p className="text-sm mt-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
        </CardContent>
      </Link>
      {user && user.username === post.author && (
        <CardFooter>
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={() => onDelete(post.id)} variant="destructive" className="ml-2">Delete</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PostCard;