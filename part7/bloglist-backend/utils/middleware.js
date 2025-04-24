const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

const requestLogger = (req, _res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, _res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }
  try {
    const decoded = jwt.verify(req.token, config.SECRET)
    if (!decoded.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    next(err)
  }
}

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _req, res, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key')
  ) {
    return res.status(400).json({ error: 'username must be unique' })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}