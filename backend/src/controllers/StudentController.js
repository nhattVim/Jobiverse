const Student = require('../models/Student')
const Major = require('../models/Major')
const Specialization = require('../models/Specialization')
const Project = require('../models/Project')

class StudentController {
  // [GET] /students
  async getAllProfiles(req, res, next) {
    try {
      const students = (await Student.find()
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        }).lean()).filter(student => student.account)
      res.json(students)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách sinh viên', error: err.message })
    }
  }

  // [GET] /students/:id
  async getProfileById(req, res, next) {
    try {
      const student = await Student.findById(req.params.id)
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        })

      if (!student || !student.account) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên hoặc tài khoản đã bị xoá' })
      }

      res.status(200).json(student.toObject())
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin sinh viên', error: err.message })
    }
  }

  // [GET] /students/me
  async getMyProfile(req, res, next) {
    try {
      const accountId = req.account._id
      const profile = await Student.findOne({ account: accountId })
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        })

      if (!profile || !profile.account) return res.status(404).json({ message: 'Không tìm thấy profile sinh viên' })
      res.status(200).json(profile)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin sinh viên', error: err.message })
    }
  }

  // [POST] /students
  async createProfile(req, res, next) {
    try {
      const accountId = req.account._id

      const existingStudent = await Student.find({ account: accountId })
      if (existingStudent.length > 0) return res.status(400).json({ message: 'Tài khoản đã có hồ sơ sinh viên' })

      const student = await Student.create({ ...req.body, account: accountId })
      return res.status(201).json({ message: 'Tạo hồ sơ sinh viên thành công', student })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lưu hồ sơ sinh viên' + err.message })
    }
  }

  // [PUT] /students
  async updateMyProfile(req, res, next) {
    try {
      const accountId = req.account._id
      const student = await Student.findOneAndUpdate({ account: accountId }, req.body, { new: true })
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' })
      return res.status(200).json({ message: 'Cập nhật hồ sơ sinh viên thành công', student })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hồ sơ sinh viên', error: err.message })
    }
  }
}

module.exports = new StudentController()
