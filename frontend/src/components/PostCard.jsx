import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const PostCard = ({ post, user, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/posts/${post.id}`} className="block">
        <Card className="h-full transition-transform duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{post.content}</p>
            <p className="text-sm mt-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
          </CardContent>
          {user && user.username === post.author && (
            <CardFooter>
              <Button onClick={(e) => { e.preventDefault(); onEdit(post); }}>Edit</Button>
              <Button onClick={(e) => { e.preventDefault(); onDelete(post.id); }} variant="destructive" className="ml-2">Delete</Button>
            </CardFooter>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};

export default PostCard;