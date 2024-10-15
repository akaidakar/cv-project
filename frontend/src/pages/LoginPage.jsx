import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add Link import
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ui/use-toast.jsx';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    try {
      console.log('Attempting to login...');
      await login(username, password);
      toast({
        title: 'Success',
        description: 'You have successfully logged in.',
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Login failed. Please try again.',
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
      {/* Add the registration link here */}
      <div className="mt-4 text-center">
        <p>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link></p>
      </div>
    </div>
  );
}
