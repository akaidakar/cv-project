import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Comment = ({ comment, postId, isPremium, onReplyAdded }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { user } = useAuth();

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const endpoint = isPremium ? `premium/${postId}/comments/` : `posts/${postId}/comments/`;
      const response = await api.post(endpoint, { text: replyText, parent: comment.id });
      console.log('Reply posted successfully:', response.data);
      onReplyAdded(response.data);
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      console.error('Error posting reply:', error.response?.data || error.message);
    }
  };

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded">
      <p>{comment.text}</p>
      <p className="text-sm text-gray-500 mt-2">
        By {comment.author} on {new Date(comment.created_at).toLocaleDateString()}
      </p>
      {user && (
        <Button onClick={() => setIsReplying(!isReplying)} className="mt-2">
          {isReplying ? 'Cancel' : 'Reply'}
        </Button>
      )}
      {isReplying && (
        <form onSubmit={handleReply} className="mt-2">
          <Input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="mb-2"
          />
          <Button type="submit">Post Reply</Button>
        </form>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          isPremium={isPremium}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </div>
  );
};

const CommentSection = ({ postId, isPremium = false }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId, isPremium]);

  const fetchComments = async () => {
    try {
      const endpoint = isPremium ? `premium/${postId}/comments/` : `posts/${postId}/comments/`;
      const response = await api.get(endpoint);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const endpoint = isPremium ? `premium/${postId}/comments/` : `posts/${postId}/comments/`;
      const response = await api.post(endpoint, { text: newComment });
      console.log('Comment posted successfully:', response.data);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error.response?.data || error.message);
    }
  };

  const handleReplyAdded = (newReply) => {
    setComments(prevComments => {
      const updateReplies = (comments) => {
        return comments.map(comment => {
          if (comment.id === newReply.parent) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          } else if (comment.replies) {
            return {
              ...comment,
              replies: updateReplies(comment.replies)
            };
          }
          return comment;
        });
      };
      return updateReplies(prevComments);
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          postId={postId}
          isPremium={isPremium}
          onReplyAdded={handleReplyAdded}
        />
      ))}
      {user && (
        <form onSubmit={handleSubmit} className="mt-4">
          <Input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2"
          />
          <Button type="submit">Post Comment</Button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;