import React from 'react'
import PropTypes from 'prop-types'
import '../index.css'

const Notification = ({ notification }) => {
  if (!notification.message) return null

  const className = notification.type === 'error' ? 'error' : 'info'

  return (
    <div className={className}>
      {notification.message}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired
}

export default Notification