import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogDetail from './components/BlogDetail'
import Navigation from './components/Navigation'

import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { loginUser, logoutUser, setUserFromLocalStorage } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const user = useSelector((state) => state.user)
  const notification = useSelector((state) => state.notification)

  useEffect(() => {
    dispatch(setUserFromLocalStorage())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials))
    } catch (error) {
      dispatch(setNotification('Wrong credentials', 'error', 5000))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const handleCreateBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      await dispatch(createBlog(blogObject))
      dispatch(
        setNotification(
          `A new blog "${blogObject.title}" by ${blogObject.author} added`,
          'success',
          5000
        )
      )
    } catch (error) {
      dispatch(setNotification('Failed to create blog', 'error', 5000))
    }
  }

  return (
    <div className="container">
      <Navigation user={user} handleLogout={handleLogout} />
      <Notification notification={notification} />

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm handleLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/"
          element={
            user ? (
              <div>
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm createBlog={handleCreateBlog} />
                </Togglable>
                <BlogList />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App