import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { token, user, logout } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          My Blog
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/posts">Posts</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/premium">Premium</Link>
          </Button>
          {token ? (
            <>
              <span className="text-lg font-medium">{user.username}</span>
              <Button variant="secondary" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="secondary" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}