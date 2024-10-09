import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';

// Components
import Navbar from './components/Navbar';
import { Toaster } from './components/ui/toaster';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostList from './components/PostList';
import CreatePostPage from './pages/CreatePostPage';
import PremiumPostsPage from './pages/PremiumPostsPage';
import CreatePremiumPostPage from './pages/CreatePremiumPostPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import SubscriptionCancelPage from './pages/SubscriptionCancelPage';
import BlogPostPage from './pages/BlogPostPage';
import SearchPage from './pages/SearchPage';
import PremiumBlogPostPage from './pages/PremiumBlogPostPage';
import EditPostPage from './pages/EditPostPage'; // Create this component if it doesn't exist
import EditPremiumPostPage from './pages/EditPremiumPostPage';

export const stripePromise = loadStripe('your_stripe_publishable_key').catch(err => {
  console.error('Failed to load Stripe:', err);
  return null;
});

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className="App">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/posts" element={<PostList />} />
                  <Route path="/posts/:id" element={<BlogPostPage />} />
                  <Route path="/edit-post/:id" element={<EditPostPage />} /> {/* Add this line */}
                  <Route path="/create-post" element={<CreatePostPage />} />
                  <Route path="/premium" element={<PremiumPostsPage />} />
                  <Route path="/create-premium-post" element={<CreatePremiumPostPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
                  <Route path="/subscription/cancel" element={<SubscriptionCancelPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/premium/:id" element={<PremiumBlogPostPage />} />
                  <Route path="/edit-premium-post/:id" element={<EditPremiumPostPage />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Toaster />
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}