const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  mssv: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  interests: String,
  university: {
    type: String,
    required: true
  },
  avatarURL: String,
}, { timestamps: true })

module.exports = mongoose.model('Student', StudentSchema);