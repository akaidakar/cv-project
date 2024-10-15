import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import Layout from './components/Layout'; // Import the Layout component

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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>
        <h1>Something went wrong.</h1>
        <pre>{this.state.error.toString()}</pre>
      </div>;
    }

    return this.props.children;
  }
}

export default function App() {
  console.log('App rendering');
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <UserProvider>
            <Layout> {/* Wrap everything inside the Layout component */}
              <div className="App">
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
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <Toaster />
              </div>
            </Layout>
          </UserProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

function NotFound() {
  const location = useLocation();
  console.log('404 - Not Found:', location);
  return <div>404 - Page Not Found</div>;
}
