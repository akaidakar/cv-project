import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PostList from './components/PostList.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import PremiumPostList from './components/PremiumPostList.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import CreatePremiumPostPage from './pages/CreatePremiumPostPage';
import PremiumPostsPage from './pages/PremiumPostsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import SubscriptionCancelPage from './pages/SubscriptionCancelPage';
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe('your_stripe_publishable_key');

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
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/premium" element={<PremiumPostsPage />} />
                <Route path="/create-premium-post" element={<CreatePremiumPostPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
                <Route path="/subscription/cancel" element={<SubscriptionCancelPage />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}