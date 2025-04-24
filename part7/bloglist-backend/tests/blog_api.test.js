const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let token = ''

beforeEach(async () => {
  await api.post('/api/testing/reset')

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  const loginRes = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  token = loginRes.body.token

  const blogPromises = helper.initialBlogs.map(blog =>
    api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
  )
  await Promise.all(blogPromises)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog objects contain id property', async () => {
    const res = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
    res.body.forEach(b => expect(b.id).toBeDefined())
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data and authorization', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Author Name',
      url: 'http://newblog.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd.map(b => b.title)).toContain(newBlog.title)
  })

  test('defaults likes to 0 if missing', async () => {
    const blogWithoutLikes = {
      title: 'No likes blog',
      author: 'Someone',
      url: 'http://nolikes.com'
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
    expect(res.body.likes).toBe(0)
  })

  test('fails with status 400 if title and url missing', async () => {
    const invalidBlog = { author: 'No title/url', likes: 10 }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with status 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'Nobody',
      url: 'http://unauth.com',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status 204 if id is valid and user is creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('succeeds updating likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updated = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updated)
      .expect(200)

    expect(res.body.likes).toBe(updated.likes)
  })
})

describe('commenting on a blog', () => {
  test('can add a comment and retrieve it', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToComment = blogsAtStart[0]
    const comment = 'Great post!'

    const res = await api
      .post(`/api/blogs/${blogToComment.id}/comments`)
      .send({ comment })
      .expect(200)

    expect(res.body.comments).toContain(comment)
  })
})