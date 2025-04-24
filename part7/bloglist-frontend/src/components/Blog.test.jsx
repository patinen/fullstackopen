import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '12345',
    title: 'Testing React Components',
    author: 'Jane Developer',
    url: 'https://example.com/blog/testing',
    likes: 42,
    user: {
      username: 'janedoe',
      name: 'Jane Developer',
    },
  }

  test('renders title and author as a link', () => {
    render(
      <Router>
        <Blog blog={blog} />
      </Router>
    )

    const link = screen.getByRole('link', {
      name: 'Testing React Components Jane Developer'
    })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/blogs/${blog.id}`)
  })
})