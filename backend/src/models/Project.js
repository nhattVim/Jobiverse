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
    _id: false,
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CV',
      required: true
    },
    cvType: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ['pending', 'rejected', 'accepted', 'invited', 'declinedInvitation'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
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
