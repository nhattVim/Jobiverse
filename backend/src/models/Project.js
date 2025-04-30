const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialization",
  },
  content: {
    type: String,
    required: true
  },
  workingTime: {
    type: String,
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
