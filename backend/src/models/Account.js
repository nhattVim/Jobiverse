const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const AccountSchema = new mongoose.Schema({
  accountType: {
    type: String,
    enum: ['student', 'employer', 'admin'],
    required: true
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
}, { timestamps: true })

// Hash password before saving
AccountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('Account', AccountSchema);