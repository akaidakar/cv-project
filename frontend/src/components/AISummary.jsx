import React, { useState } from 'react';
import api from '../api';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const AISummary = ({ content }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const response = await api.post('ai/summarize/', { content });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Button onClick={generateSummary} disabled={loading}>
        {loading ? 'Generating...' : 'Generate AI Summary'}
      </Button>
      {summary && (
        <Card className="mt-4">
          <CardContent>
            <h3 className="text-xl font-bold mb-2">AI-Generated Summary</h3>
            <p>{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AISummary;