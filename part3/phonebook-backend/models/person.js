const mongoose = require('mongoose')

function customValidator(value) {
  return /^\d{2,3}-\d+$/.test(value)
}

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: { type: String, required: true, validate: [customValidator, 'Invalid phone number format'] }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.post('save', function (doc) {
  console.log(`Saved Person: ${doc.name} (${doc.number}) with ID: ${doc._id}`)
})

personSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    console.log(`Deleted Person: ${doc.name} (${doc.number}) with ID: ${doc._id}`)
  } else {
    console.log('No person found for deletion')
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person