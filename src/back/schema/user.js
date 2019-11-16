import mongoose from 'mongoose'

var schema = new mongoose.Schema({
  username: String,
  created: Date,
  password: String,
  // enabled: Boolean,
})

export const User = mongoose.model('user', schema, 'user')
