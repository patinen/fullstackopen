import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export const create = (newBlog) => {
  const config = { headers: { Authorization: token } }
  const request = axios.post(baseUrl, newBlog, config)
  return request.then((response) => response.data)
}

export const update = (id, updatedBlog) => {
  const config = { headers: { Authorization: token } }
  const request = axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return request.then((response) => response.data)
}

export const remove = (id) => {
  const config = { headers: { Authorization: token } }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then((response) => response.data)
}

export const comment = (id, comment) => {
  const config = { headers: { Authorization: token } }
  const request = axios.post(
    `${baseUrl}/${id}/comments`,
    { comment },
    config
  )
  return request.then((response) => response.data)
}

export default { getAll, create, update, remove, comment, setToken }