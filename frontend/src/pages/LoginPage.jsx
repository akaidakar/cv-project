import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../components/ui/use-toast.jsx';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/dj-rest-auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log(data); // Log the response data
      if (response.ok) {
        login({ token: data.key, user: data.user });
        navigate('/'); // Redirect to homepage after login
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error); // Log the error
      toast({
        title: 'Error',
        description: 'Login failed. Please check your credentials and try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-blue-500">Sign up</a>
      </p>
    </div>
  );
}