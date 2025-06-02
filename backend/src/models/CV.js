const mongoose = require('mongoose')

const CVSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: String,
  avatar: String,
  name: String,
  birthday: Date,
  gender: String,
  phone: String,
  email: String,
  address: String,
  website: String,
  summary: String,
  desiredPosition: String,

  experiences: [{
    position: String,
    company: String,
    start: Date,
    end: Date,
    description: String
  }],

  educations: [{
    degree: String,
    school: String,
    start: Date,
    end: Date
  }],

  activities: [{
    title: String,
    organization: String,
    start: Date,
    end: Date,
    description: String
  }],

  achievements: [{
    title: String,
    description: String
  }],

  languages: [{
    language: String,
    level: String
  }],

  socials: [{
    platform: String,
    link: String
  }],

  skills: [String],

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

CVSchema.set('toJSON', {
  transform: function (doc, ret) {
    const formatDate = (date) => {
      if (!date) return null
      const d = new Date(date)
      const day = String(d.getUTCDate()).padStart(2, '0')
      const month = String(d.getUTCMonth() + 1).padStart(2, '0')
      const year = d.getUTCFullYear()
      return `${year}-${month}-${day}`
    }

    ret.birthday = formatDate(ret.birthday)
    ret.lastUpdated = formatDate(ret.lastUpdated)

    const formatArrayDates = (arr) => {
      if (!Array.isArray(arr)) return
      arr.forEach(item => {
        if (item.start) item.start = formatDate(item.start)
        if (item.end) item.end = formatDate(item.end)
      })
    }

    formatArrayDates(ret.educations)
    formatArrayDates(ret.experiences)
    formatArrayDates(ret.activities)

    return ret
  }
})

module.exports = mongoose.model('CV', CVSchema)
