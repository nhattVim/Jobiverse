const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const AccountSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['student', 'employer', 'admin'],
    required: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  avatar: {
    data: Buffer,
    contentType: String
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  password: String,
  deleted: {
    type: Boolean,
    default: false
  },
  profile: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

// Middleware to check before validating
AccountSchema.pre('validate', function (next) {
  if (this.authProvider === 'local' && !this.password) {
    this.invalidate('password', 'Password is required for local accounts')
  }
  next()
})

// Hash password before saving
AccountSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// Hide password field when converting to JSON
AccountSchema.method.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('Account', AccountSchema)
