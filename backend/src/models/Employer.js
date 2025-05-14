const mongoose = require('mongoose')

const EmployerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true
  },
  businessScale: {
    type: String,
    enum: ['Private individuals', 'Companies'],
    required: true
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
  interests: [{ type: String }],
  industry: {
    type: String,
    required: true
  },
  companyInfo: String,
  prove: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Employer', EmployerSchema)
