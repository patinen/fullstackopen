import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data

    case 'CREATE_BLOG':
      return [...state, action.data]

    case 'LIKE_BLOG':
      return state.map((b) =>
        b.id === action.data.id ? action.data : b
      )

    case 'REMOVE_BLOG':
      return state.filter((b) => b.id !== action.data)

    case 'COMMENT_BLOG':
      return state.map((b) =>
        b.id === action.data.id ? action.data : b
      )

    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({ type: 'INIT_BLOGS', data: blogs })
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch({ type: 'CREATE_BLOG', data: newBlog })
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: typeof blog.user === 'object' ? blog.user.id : blog.user,
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    dispatch({ type: 'LIKE_BLOG', data: returnedBlog })
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({ type: 'REMOVE_BLOG', data: id })
  }
}

export const commentBlog = (id, commentText) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.comment(id, commentText)
    dispatch({ type: 'COMMENT_BLOG', data: updatedBlog })
  }
}

export default blogReducer