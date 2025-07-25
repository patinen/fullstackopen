import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog }) => (
  <div style={blogStyle}>
    <Link to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  </div>
)

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired
  }).isRequired
}

export default Blog