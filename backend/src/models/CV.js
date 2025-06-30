const mongoose = require('mongoose')

const CVSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: String,
  avatar: String,
  name: String,
  birthday: Date,
  gender: String,
  phone: String,
  email: String,
  address: String,
  website: String,
  summary: String,
  desiredPosition: String,

  experiences: [{
    position: String,
    company: String,
    start: Date,
    end: Date,
    description: String
  }],

  educations: [{
    degree: String,
    school: String,
    start: Date,
    end: Date
  }],

  activities: [{
    title: String,
    organization: String,
    start: Date,
    end: Date,
    description: String
  }],

  achievements: [{
    title: String,
    description: String
  }],

  languages: [{
    language: String,
    level: String
  }],

  socials: [{
    platform: String,
    link: String
  }],

  skills: [String],

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

module.exports = mongoose.model('CV', CVSchema)
