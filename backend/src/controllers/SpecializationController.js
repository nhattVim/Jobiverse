const Specialization = require('../models/Specialization')

class SpecializationController {
  // [GET] /specx
  async getAllSpecializations(req, res, next) {
    try {
      const specializations = await Specialization.find().select('-__v')
      res.json(specializations)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách chuyên ngành', error: err.message })
    }
  }

  // [GET] /specs/:id
  async getSpecializationById(req, res, next) {
    try {
      const specialization = await Specialization.findById(req.params.id).select('-__v')
      if (!specialization) return res.status(404).json({ message: 'Không tìm thấy chuyên ngành' })
      res.status(200).json(specialization)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin chuyên ngành', error: err.message })
    }
  }
}

module.exports = new SpecializationController()
