import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

const Comment = ({ comment, postId, isPremium, onReplyAdded, depth = 0 }) => {
  console.log('Rendering comment:', comment); // Add this line
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { user } = useAuth();

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const endpoint = isPremium ? `premium/${postId}/comments/` : `posts/${postId}/comments/`;
      const response = await api.post(endpoint, { text: replyText, parent: comment.id });
      onReplyAdded(response.data);
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      console.error('Error posting reply:', error.response?.data || error.message);
    }
  };

  return (
    <div className={`mb-4 p-4 bg-gray-100 rounded ${depth > 0 ? 'ml-4' : ''}`}>
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
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border rounded mb-2"
            rows="2"
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
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

const CommentSection = ({ postId, isPremium }) => {
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
      console.log('Fetched comments:', response.data); // Add this line
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
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error.response?.data || error.message);
    }
  };

  const handleReplyAdded = (newReply) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === newReply.parent) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={{
            id: comment.id,
            text: comment.text || comment.content, // Handle both 'text' and 'content' fields
            author: comment.author || comment.user?.username || 'Anonymous', // Handle different author fields
            created_at: comment.created_at,
            replies: comment.replies || []
          }}
          postId={postId}
          isPremium={isPremium}
          onReplyAdded={handleReplyAdded}
        />
      ))}
      {user && (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded mb-2"
            rows="4"
          />
          <Button type="submit">Post Comment</Button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;