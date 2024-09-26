import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PostList from './components/PostList.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx'; // Add this import
import PremiumPostList from './components/PremiumPostList.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className="App">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/create-post" element={<CreatePostPage />} /> {/* Add this route */}
                <Route
                  path="/premium"
                  element={
                    <ProtectedRoute requirePremium>
                      <PremiumPostList />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Toaster />
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}