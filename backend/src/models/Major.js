const mongoose = require('mongoose')

const MajorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String
})

module.exports = mongoose.model('Major', MajorSchema)
