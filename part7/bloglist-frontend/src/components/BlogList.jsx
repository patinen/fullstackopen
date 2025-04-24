import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  const sortedBlogs = useMemo(
    () => [...blogs].sort((a, b) => b.likes - a.likes),
    [blogs]
  )

  if (sortedBlogs.length === 0) {
    return <p>No blogs found.</p>
  }

  return (
    <div className="mt-3">
      {sortedBlogs.map(blog => (
        <div key={blog.id} className="mb-2">
          <Link to={`/blogs/${blog.id}`} className="text-decoration-none">
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList