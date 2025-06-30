const mongoose = require('mongoose')

async function connect() {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI is not defined in .env file')
    await mongoose.connect(uri, { autoIndex: false })
    console.log('Connect successfully!')
  } catch (error) {
    console.error('Connect failure!', error)
  }
}

module.exports = { connect }
