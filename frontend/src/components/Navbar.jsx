import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { authToken, handleLogout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Blog App</Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/posts" className="text-white hover:text-gray-300">Posts</Link>
          </li>
          {authToken ? (
            <>
              <li>
                <Link to="/premium-posts" className="text-white hover:text-gray-300">Premium Posts</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;