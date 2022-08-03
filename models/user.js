const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
uniqueValidator.defaults.message = '{PATH} must be unique'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '{PATH} is required'],
    minlength: [6, '{PATH} must be at least 6 digit, got {VALUE}'],
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: [true, '{PATH} is required'],
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User