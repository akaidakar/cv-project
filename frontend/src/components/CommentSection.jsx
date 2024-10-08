import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  console.log('Rendering CommentSection with comments:', comments);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${postId}/comments/`);
      console.log('Fetched comments:', response.data);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const commentData = {
      text: newComment,
      parent: replyingTo
    };
    console.log('Sending comment data:', commentData);
    try {
      const response = await api.post(`/posts/${postId}/comments/`, commentData);
      console.log('Response:', response.data);
      setComments(prevComments => {
        console.log('Previous comments:', prevComments);
        const updatedComments = [...prevComments, response.data];
        console.log('Updated comments:', updatedComments);
        return updatedComments;
      });
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting comment:', error.response?.data || error.message);
    }
  };

  const renderComments = (parentId = null, depth = 0) => {
    return comments
      .filter(comment => comment.parent === parentId)
      .map(comment => (
        <Card key={comment.id} className={`ml-${depth * 4} mb-2`}>
          <CardContent>
            <p>{comment.text}</p>
            <p className="text-sm">By {comment.author} on {new Date(comment.created_at).toLocaleDateString()}</p>
            <Button onClick={() => setReplyingTo(comment.id)} variant="outline" size="sm">Reply</Button>
            {renderComments(comment.id, depth + 1)}
          </CardContent>
        </Card>
      ));
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.length > 0 ? renderComments() : <p>No comments yet.</p>}
      <form onSubmit={handleSubmit} className="mt-4">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
          className="mb-2"
        />
        <Button type="submit">Post {replyingTo ? 'Reply' : 'Comment'}</Button>
        {replyingTo && (
          <Button onClick={() => setReplyingTo(null)} variant="outline" className="ml-2">
            Cancel Reply
          </Button>
        )}
      </form>
    </div>
  );
};

export default CommentSection;