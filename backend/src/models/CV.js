const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: String,
  avatar: String,
  name: String,
  birthday: String,
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
    start: String,
    end: String,
    description: String
  }],

  educations: [{
    degree: String,
    school: String,
    start: String,
    end: String,
  }],

  activities: [{
    title: String,
    organization: String,
    start: String,
    end: String,
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

  files: [{
    fileName: String,
    fileURL: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CV', CVSchema);
