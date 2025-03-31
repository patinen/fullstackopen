import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Jane Developer',
    url: 'https://example.com/blog/testing',
    likes: 42,
    user: {
      username: 'janedoe',
      name: 'Jane Developer'
    }
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} />)

    const titleAndAuthor = screen.getByText(/Testing React Components Jane Developer/i)
    expect(titleAndAuthor).toBeDefined()

    const url = screen.queryByText(blog.url)
    expect(url).toBeNull()

    const likes = screen.queryByText(/likes/i)
    expect(likes).toBeNull()
  })
})