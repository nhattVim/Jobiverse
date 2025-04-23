const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  accountType: {
    type: String,
    enum: ['student', 'employer', 'admin'],
    required: true
  },
  email: String,
  password: String,
  token: String,
  deleted: {
    type: Boolean,
    default: false
  },
}, { timestamps: true })

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);