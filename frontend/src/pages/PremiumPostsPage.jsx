import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext.jsx'; // Ensure the .jsx extension is added
import { useToast } from '../components/ui/use-toast.jsx';

export default function PremiumPostsPage() {
  const [premiumPosts, setPremiumPosts] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/v1/premium/', { // Ensure this matches your backend URL
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched premium posts:', data); // Add this line to debug the response
        if (Array.isArray(data)) {
          setPremiumPosts(data);
        } else {
          console.error('Unexpected response format:', data);
          setPremiumPosts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching premium posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch premium posts. Please try again.',
          variant: 'destructive'
        });
        setPremiumPosts([]);
      });
  }, [token, navigate, toast]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Premium Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {premiumPosts.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.blog_post?.title || post.title || 'Untitled Post'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{post.premium_content || post.body || 'No content available'}</p>
              <p className="text-sm">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}