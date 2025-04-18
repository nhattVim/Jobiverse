const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  token: String,
  address: {
    // Tỉnh
    province: String,
    // Thành phố,thị xã
    district: String,
    // Xã phường
    ward: String,
    // Đường
    street: String
  },
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