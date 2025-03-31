import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, likeBlog, deleteBlog, user }) => (
  <>
    {blogs.map(blog => (
      <Blog
        key={blog.id}
        blog={blog}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
        user={user}
      />
    ))}
  </>
)

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default BlogList