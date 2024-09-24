import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import PremiumPostList from './components/PremiumPostList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/posts" 
            element={
              <PrivateRoute>
                <PostList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/premium-posts" 
            element={
              <PrivateRoute>
                <PremiumPostList />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;