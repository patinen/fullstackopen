import { useState, useEffect } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useRef } from 'react'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user && blog.user.id ? blog.user.id : blog.user
    }
  
    try {
      await blogService.update(blog.id, updatedBlog)
      const updatedBlogs = await blogService.getAll()
      updatedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    } catch (error) {
      console.error('Failed to like blog:', error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })
  
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
  
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification('Wrong credentials')
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const showNotification = (message, duration = 5000) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => {
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
    }
  }, [user])

  const addBlog = async (blogObject) => {
    console.log('Creating blog with:', blogObject)
    try {
      const newBlog = await blogService.create(blogObject)
      const updatedBlogs = [...blogs, newBlog].sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
      blogFormRef.current.toggleVisibility()
      showNotification(`Added blog: ${newBlog.title} by ${newBlog.author}`)
    } catch (error) {
      console.error('Failed to create blog:', error)
    }
  }

  const deleteBlog = async (blog) => {
    const ok = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (!ok) return
  
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      showNotification(`Deleted blog: ${blog.title}`)
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <BlogList blogs={blogs} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user} />
    </div>
  )
}

export default App