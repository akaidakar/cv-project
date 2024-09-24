import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function RegularPostsPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/posts/') // Ensure this matches your backend URL
      .then(response => response.json())
      .then(data => {
        console.log('Fetched posts:', data); // Add this line to debug the response
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Unexpected response format:', data);
          setPosts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setPosts([]);
      });
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Regular Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{post.body.substring(0, 100)}...</p>
              <p className="text-sm">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}