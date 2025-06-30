const Employer = require('../models/Employer')

class EmployerController {
  // [GET] /employers
  async getAllProfiles(req, res, next) {
    try {
      const employers = (await Employer.find()
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        })).filter(employer => employer.account)
      res.json(employers)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách employer', error: err.message })
    }
  }

  // [GET] /employers/:id
  async getProfileById(req, res, next) {
    try {
      const accountId = req.params.id
      const employer = await Employer.findOne({ account: accountId })
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password'
        })
        .lean()

      if (!employer || !employer.account) {
        return res.status(404).json({ message: 'Không tìm thấy employer hoặc tài khoản đã bị xoá' })
      }

      res.status(200).json(employer)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin employer', error: err.message })
    }
  }

  // [GET] /employers/me
  async getMyProfile(req, res, next) {
    const accountId = req.account._id
    try {
      const employer = await Employer.findOne({ account: accountId }).select('-__v')
      if (!employer) return res.status(404).json({ message: 'Không tìm thấy employer hoặc tài khoản đã bị xoá' })
      res.status(200).json(employer)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin employer', error: err.message })
    }
  }

  // [POST] /employers
  async createProfile(req, res, next) {
    try {
      const accountId = req.account._id

      const existingEmployer = await Employer.findOne({ account: accountId })
      if (existingEmployer) return res.status(400).json({ message: 'Tài khoản đã có hồ sơ employer' })

      const employer = await Employer.create({ ...req.body, account: accountId })
      if (!employer) return res.status(400).json({ message: 'Lỗi khi tạo hồ sơ employer' })

      res.status(201).json({ message: 'Tạo hồ sơ employer thành công', employer })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo employer', error: err.message })
    }
  }

  // [PUT] /employers
  async updateMyProfile(req, res, next) {
    try {
      const accountId = req.account._id
      const updatedEmployer = await Employer.findOneAndUpdate({ account: accountId }, req.body, { new: true })
      if (!updatedEmployer) return res.status(404).json({ message: 'Không tìm thấy employer' })
      res.status(200).json({ message: 'Cập nhật hồ sơ employer thành công', updatedEmployer })
    }
    catch (err) {
      res.status(500).json({ message: 'Lỗi khi cập nhật employer', error: err.message })
    }
  }
}

module.exports = new EmployerController()
