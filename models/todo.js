const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

let TodoSchema = new mongoose.Schema({
  userCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    minLength: [
      5,
      'Todo title must be at least 5 characters long'
    ]
  },
  description: String,
  completed: Boolean
})

let Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo
