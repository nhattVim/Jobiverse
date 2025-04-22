const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  employerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: string,
  skillsRequired: {
    type: String,
    required: true
  },
  benefits: {
    type: String,
    required: true
  },
  workingTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open'
  },
}, { timestamps: true })

module.exports = mongoose.model('Project', ProjectSchema);