require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (!url) {
  console.error('Error: MONGODB_URI is missing from .env file!')
  process.exit(1)
}

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: { type: String, required: true, validate: [customValidator, 'Invalid phone number format'] }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 2) {
  console.error('Please provide the required arguments.')
  process.exit(1)
} else if (process.argv.length === 3) {
  Person.find({})
    .then((persons) => {
      console.log('Phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch(err => {
      console.error('Error fetching phonebook entries:', err.message)
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save()
    .then(() => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.error('Error saving person:', err.message)
      mongoose.connection.close()
    })
} else {
  console.error('Invalid number of arguments')
  mongoose.connection.close()
}