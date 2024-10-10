import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from './ui/input';

export default function Navbar() {
  const { isAuthenticated, user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleSubscribeClick = (e) => {
    e.preventDefault();
    console.log('Subscribe button clicked');
    console.log('Current location:', location);
    navigate('/subscription');
    console.log('After navigation, location:', location);
  };

  React.useEffect(() => {
    console.log('Location changed:', location);
  }, [location]);

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
          <Link to="/posts" className="text-primary-foreground hover:underline">Posts</Link>
          <Link to="/premium" className="text-primary-foreground hover:underline">Premium</Link>
          {isAuthenticated ? (
            <>
              {user?.username && <span>Welcome, {user.username}</span>}
              <a href="/subscription" onClick={handleSubscribeClick} className="text-primary-foreground hover:underline">
                Subscribe
              </a>
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