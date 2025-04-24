import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const { id } = useParams()
  const user = useSelector((state) =>
    state.users.find((u) => u.id === id)
  )

  if (!user) {
    return <p>User not found.</p>
  }

  return (
    <div className="container">
      <h2>{user.name}</h2>
      <h3 className="mt-4">Added blogs</h3>
      {user.blogs && user.blogs.length > 0 ? (
        <ul className="list-group list-group-flush">
          {user.blogs.map((blog) => (
            <li key={blog.id} className="list-group-item">
              {blog.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No blogs added yet.</p>
      )}
    </div>
  )
}

export default User