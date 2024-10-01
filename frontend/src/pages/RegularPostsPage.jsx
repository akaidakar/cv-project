import React from 'react'
import PostList from '../components/PostList'

export default function RegularPostsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Regular Posts</h1>
      <PostList />
    </div>
  )
}