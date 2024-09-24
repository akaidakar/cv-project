import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/toaster.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import RegularPostsPage from './pages/RegularPostsPage.jsx';
import PremiumPostsPage from './pages/PremiumPostsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts" element={<RegularPostsPage />} />
              <Route path="/premium" element={<PremiumPostsPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}