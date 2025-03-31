import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    user: PropTypes.object
  }  

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {user && blog.user?.username === user.username && (
            <button onClick={() => deleteBlog(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog