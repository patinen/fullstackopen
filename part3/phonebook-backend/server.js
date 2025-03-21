require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => {
      console.log(`Added person: ${savedPerson.name} (${savedPerson.number})`)
      res.json(savedPerson)
    })
    .catch(err => {
      console.error('Error saving person:', err)
      next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  console.log('Full Request URL:', req.originalUrl)
  console.log('Received DELETE request with ID:', req.params.id)

  if (!req.params.id || req.params.id === 'undefined') {
    console.error('Error: Invalid or missing ID')
    return res.status(400).json({ error: 'Invalid ID received' })
  }

  Person.findByIdAndDelete(req.params.id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        console.error('Error: Person not found in database.')
        return res.status(404).json({ error: 'Person not found' })
      }
      console.log(`Successfully deleted: ${deletedPerson.name}`)
      res.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: 'Something went wrong on the server' })
}

app.use(errorHandler)

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).json({ error: 'Person not found' })
    })
    .catch(err => next(err))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})