const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true
  },
  mssv: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major'
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialization'
  },
  interests: [{ type: String }],
  university: {
    type: String,
    required: true
  },
  avatarURL: String
})

module.exports = mongoose.model('Student', StudentSchema)
