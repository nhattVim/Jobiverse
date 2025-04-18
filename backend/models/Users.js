const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}, { timestamps: true })

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// module.exports = mongoose.model("User", UserSchema, "users");

const User = mongoose.model('User', UserSchema, 'users');  // 'users' là tên collection

module.exports = User;