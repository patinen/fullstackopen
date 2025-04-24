const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body
  const user = req.user

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' })
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

  const populatedBlog = await Blog.findById(savedBlog._id)
    .populate('user', { username: 1, name: 1 })

  res.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body

  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })

  if (!updated) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.json(updated)
})

blogsRouter.post('/:id/comments', async (req, res) => {
  const { comment } = req.body
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  blog.comments = blog.comments.concat(comment)
  const saved = await blog.save()
  const populated = await saved.populate('user', { username: 1, name: 1 })

  res.json(populated)
})

module.exports = blogsRouter