const initialState = {
  message: '',
  type: ''
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        message: action.payload.message,
        type: action.payload.type
      }
    case 'CLEAR_NOTIFICATION':
      return initialState
    default:
      return state
  }
}

export const setNotification = (message, type = 'info', seconds = 5) => {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, type }
    })

    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export const clearNotification = () => ({
  type: 'CLEAR_NOTIFICATION'
})

export default notificationReducer