import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from './ui/input';

export default function Navbar() {
  const { isAuthenticated, user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          My Blog
        </Link>
        <form onSubmit={handleSearch} className="flex-grow mx-4">
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </form>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/posts">Posts</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/premium">Premium</Link>
          </Button>
          {isAuthenticated ? (
            <>
              {user?.username && <span>Welcome, {user.username}</span>}
              <Button variant="ghost" asChild>
                <Link to="/subscription">Subscribe</Link>
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
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