import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to My Blog</h1>
      <p className="text-xl mb-8">Discover amazing content in our regular and premium posts.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/posts">Explore Posts</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/premium">Go Premium</Link>
        </Button>
      </div>
    </div>
  )
}