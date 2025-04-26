const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
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
})

module.exports = mongoose.model('Employer', EmployerSchema);