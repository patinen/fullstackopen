import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">blogs</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/users">users</Link>
          </li>
        </ul>
        <span className="navbar-text me-3">
          {user
            ? `${user.name} logged in`
            : <Link className="nav-link d-inline p-0" to="/login">login</Link>
          }
        </span>
        {user && (
          <button
            onClick={handleLogout}
            className="btn btn-outline-secondary btn-sm"
          >
            logout
          </button>
        )}
      </div>
    </div>
  </nav>
)

Navigation.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  handleLogout: PropTypes.func.isRequired
}

Navigation.defaultProps = {
  user: null
}

export default Navigation