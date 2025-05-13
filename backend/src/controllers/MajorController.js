const Major = require('../models/Major')

class MajorController {
  // [GET] /majors
  async getAllMajors(req, res, next) {
    try {
      const majors = await Major.find().select('-__v')
      res.json(majors)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách ngành nghề', error: err.message })
    }
  }

  // [GET] /majors/:id
  async getMajorById(req, res, next) {
    try {
      const major = await Major.findById(req.params.id).select('-__v')
      if (!major) return res.status(404).json({ message: 'Không tìm thấy ngành nghề' })
      res.status(200).json(major)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin ngành nghề', error: err.message })
    }
  }
}

module.exports = new MajorController()
