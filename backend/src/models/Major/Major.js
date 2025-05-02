const mongoose = require("mongoose");

const MajorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Major', MajorSchema);