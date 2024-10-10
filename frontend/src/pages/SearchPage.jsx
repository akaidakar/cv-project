import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSearchTerm(searchParams.get('q') || '');
    setAuthors([]);

    fetchAuthors();
  }, [location]);

  const fetchAuthors = async () => {
    try {
      console.log('Fetching authors...');
      const response = await api.get('authors/');
      console.log('Authors response:', response);
      console.log('Authors data:', response.data);
      setAuthors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching authors:', error);
      setError('Failed to fetch authors');
      setAuthors([]);
    }
  };

  const performSearch = async (query = searchTerm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('search/', {
        params: { q: query }
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error performing search:', error);
      setError('Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Posts</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        performSearch();
      }} className="flex space-x-4 mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {results.length > 0 ? (
        results.map(post => (
          <Card key={post.id} className="mb-4">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content.substring(0, 150)}...</p>
              <p className="text-sm text-gray-500 mt-2">By {post.author}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;