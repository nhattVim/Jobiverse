const mongoose = require('mongoose')

const CVUploadSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: String,
  fileName: String,
  file: Buffer,
  fileType: {
    type: String,
    default: 'application/pdf'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

module.exports = mongoose.model('CVUpload', CVUploadSchema)
