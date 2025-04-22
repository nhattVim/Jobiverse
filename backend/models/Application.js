const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open'
  }
}, { timestamps: true })

module.exports = mongoose.model('Application', ApplicationSchema);