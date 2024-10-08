import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSearchTerm(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
    setAuthor(searchParams.get('author') || '');

    fetchCategories();
    fetchAuthors();
  }, [location]);

  useEffect(() => {
    if (searchTerm || category || author) {
      performSearch();
    }
  }, [searchTerm, category, author]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await api.get('authors/');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const performSearch = async () => {
    try {
      const response = await api.get('search/', {
        params: { q: searchTerm, category, author }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Posts</h1>
      <div className="flex space-x-4 mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="flex-grow"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Select>
        <Select value={author} onChange={(e) => setAuthor(e.target.value)}>
          <option value="">All Authors</option>
          {authors.map(auth => (
            <option key={auth.id} value={auth.id}>{auth.name}</option>
          ))}
        </Select>
        <Button onClick={performSearch}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content.substring(0, 100)}...</p>
              <p className="text-sm mt-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;