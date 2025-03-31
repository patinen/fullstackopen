const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First blog post',
    author: 'John Doe',
    url: 'http://example.com/first',
    likes: 5,
  },
  {
    title: 'Second blog post',
    author: 'Jane Smith',
    url: 'http://example.com/second',
    likes: 10,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temporary',
    author: 'Nobody',
    url: 'http://temp.com',
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}