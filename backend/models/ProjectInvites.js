const mongoose = require("mongoose");

const ProjectInvite = new mongoose.Schema({
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['invited', 'accepted', 'declined'],
    default: 'invited'
  },
  invitedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

module.exports = mongoose.model('CV', ProjectInvite);