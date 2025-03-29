const path = require('path')

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
require('dotenv').config({ path: path.resolve(__dirname, '..', envFile) })

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 3001
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}