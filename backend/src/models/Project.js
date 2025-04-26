const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
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
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, { timestamps: true });


module.exports = mongoose.model('Project', ProjectSchema);
