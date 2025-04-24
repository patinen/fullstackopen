import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then((data) => setUsers(data))
  }, [])

  if (users.length === 0) {
    return <p className="mt-4">Loading users...</p>
  }

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`} className="text-decoration-none">
                  {user.name}
                </Link>
              </td>
              <td>{user.blogs?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users