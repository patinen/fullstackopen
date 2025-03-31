const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user 

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    username: 1,
    name: 1
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  const user = req.user

  if (!blog) return res.status(404).json({ error: 'blog not found' })

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(403).json({ error: 'unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })

  if (!updatedBlog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.json(updatedBlog)
})

module.exports = blogsRouter