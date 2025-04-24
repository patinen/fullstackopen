import loginService from '../services/login'
import blogService from '../services/blogs'

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER_FROM_LOCAL_STORAGE':
      return action.data
    case 'LOGIN_USER':
      return action.data
    case 'LOGOUT_USER':
      return null
    default:
      return state
  }
}

export const setUserFromLocalStorage = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'SET_USER_FROM_LOCAL_STORAGE',
        data: user
      })
    }
  }
}

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem(
      'loggedBlogAppUser',
      JSON.stringify(user)
    )
    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN_USER',
      data: user
    })
  }
}

export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch({ type: 'LOGOUT_USER' })
  }
}

export default userReducer