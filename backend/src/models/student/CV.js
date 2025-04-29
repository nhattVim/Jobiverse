const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  summary: String,
  skills: String,
  experience: String,
  education: String,
  certifications: String,
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
}, { timestamps: true })

module.exports = mongoose.model('CV', CVSchema);