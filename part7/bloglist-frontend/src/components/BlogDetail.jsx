import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { Alert, Button, Form, ListGroup, InputGroup } from 'react-bootstrap'

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')

  if (!blog) {
    return <Alert variant="warning">Blog not found.</Alert>
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
      navigate('/')
    }
  }

  const handleCommentSubmit = e => {
    e.preventDefault()
    const trimmed = comment.trim()
    if (!trimmed) return
    dispatch(commentBlog(blog.id, trimmed))
    setComment('')
  }

  return (
    <div className="container mt-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back
      </Button>

      <h2>{blog.title} by {blog.author}</h2>
      {blog.url && (
        <div className="mb-2">
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </div>
      )}
      <div className="mb-2">
        {blog.likes} likes{' '}
        <Button size="sm" variant="primary" onClick={handleLike}>
          like
        </Button>
      </div>
      <div className="mb-3">added by {blog.user?.name || 'Unknown'}</div>

      {user?.username === blog.user?.username && (
        <Button variant="danger" size="sm" onClick={handleRemove} className="mb-4">
          remove
        </Button>
      )}

      <h3>Comments</h3>
      <Form onSubmit={handleCommentSubmit} className="mb-3">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button type="submit" variant="success">
            add
          </Button>
        </InputGroup>
      </Form>

      {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
        <ListGroup variant="flush">
          {blog.comments.map((c, idx) => (
            <ListGroup.Item key={idx}>{c}</ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  )
}

export default BlogDetail