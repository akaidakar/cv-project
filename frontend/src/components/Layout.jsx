import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const isSearchPage = location.pathname === '/search';
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setShowSignOutModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-gray-100">
        <Link to="/" className="text-2xl font-bold">My Blog</Link>
        {!isSearchPage && (
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Search..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        )}
        <div className="space-x-4">
          <Link to="/posts">Posts</Link>
          <Link to="/premium">Premium</Link>
          {user && <span>Welcome, {user.username}</span>}
          <Link to="/subscription">Subscribe</Link>
          {user ? (
            <Button onClick={() => setShowSignOutModal(true)} variant="destructive">Sign Out</Button>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
      <main className="p-4">
        {children}
      </main>

      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to sign out?</h2>
            <p className="mb-4">You will be logged out of your account.</p>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setShowSignOutModal(false)} variant="outline">Cancel</Button>
              <Button onClick={handleSignOut} variant="destructive">Sign Out</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;