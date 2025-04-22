const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  representativeName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  interests: String,
  industry: {
    type: String,
    required: true
  },
  companyInfo: String,
}, { timestamps: true })

module.exports = mongoose.model('Employer', EmployerSchema);