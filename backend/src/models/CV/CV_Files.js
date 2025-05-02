const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  cv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileURL: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('File', FileSchema);
