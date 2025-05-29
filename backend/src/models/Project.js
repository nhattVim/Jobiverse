const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  title: String,
  description: String,
  location: {
    province: String,
    district: String,
    ward: String
  },
  major: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major'
  }],
  specialization: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialization'
  }],
  content: String,
  workingTime: String,
  status: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open'
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  salary: Number,
  expRequired: Number,
  deadline: Date,
  hiringCount: {
    type: Number,
    default: 1
  },
  workType: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  }
}, { timestamps: true })

module.exports = mongoose.model('Project', ProjectSchema)
