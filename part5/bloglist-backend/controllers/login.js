const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  console.log('Attempting login with username:', username)

  const user = await User.findOne({ username })

  if (!user || !user.passwordHash) {
    return response.status(401).json({ error: 'invalid username or password' })
  }
  
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 }) // 1 hour

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  })
})

module.exports = loginRouter