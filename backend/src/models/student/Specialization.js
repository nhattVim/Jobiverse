const mongoose = require("mongoose");

const SpecializationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Major",
    required: true
  },
})

module.exports = mongoose.model('Specialization', SpecializationSchema);