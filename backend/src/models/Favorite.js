const mongoose = require('mongoose')

const FavoriteSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Favorite', FavoriteSchema)