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
  defaultCV: {
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'defaultCVModel',
      default: null
    },
    type: {
      type: String,
      enum: ['CV', 'CVUpload'],
      default: null
    }
  }
})

module.exports = mongoose.model('Student', StudentSchema)
