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

  // [GET] /students/search
  async searchProfiles(req, res, next) {
    try {
      const { mssv, name } = req.query

      const searchQuery = {}
      if (mssv) searchQuery.mssv = new RegExp(mssv, 'i')
      if (name) searchQuery.name = new RegExp(name, 'i')

      const students = await Student.find(searchQuery)
        .select('-__v')
        .populate('account', '-password -__v')

      res.status(200).json({ students })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tìm kiếm sinh viên', error: err.message })
    }
  }

  // [GET] /student/filter
  async filterProfile(req, res, next) {
    try {
      const majorName = req.query.major
      const specializationName = req.query.specialization

      if (!majorName) {
        return res.status(400).json({ message: 'Thiếu tên ngành (major)' })
      }

      const majorDoc = await Major.findOne({ name: new RegExp(majorName, 'i') })
      if (!majorDoc) {
        return res.status(404).json({ message: 'Không tìm thấy ngành' })
      }

      var filter = { major: majorDoc._id }
      var populateFields = ['major']

      if (specializationName) {
        const specializationDoc = await Specialization.findOne({ name: new RegExp(specializationName, 'i') })

        if (!specializationDoc) {
          return res.status(404).json({ message: 'Không tìm thấy chuyên ngành' })
        }
        //thêm specialization vào filter hình dung : filter = { specialization: specializationDoc._id }
        filter.specialization = specializationDoc._id
        populateFields.push('specialization')
      }

      const students = await Student.find(filter).populate(populateFields)

      if (!students.length) {
        return res.status(404).json({ message: 'Không có project nào phù hợp' })
      }

      res.status(200).json({ students })

    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  async recommendProfile(req, res, next) {
    try {
      const projectId = req.params.id
      const project = await Project.findById(projectId)
      if (!project) {
        return res.status(404).json({ message: 'Không tồn tại project' })
      }
      const majorId = project.major._id
      const specializationId = project.specialization._id
      const students = await Student.find({
        _id: { $ne: projectId },
        major: majorId,
        specialization: specializationId
      })
        .select('-__v')
        .populate('major', '-__v')
        .populate('description', '-__v')
      if (!students || students.length === 0) {
        return res.status(404).json({ message: 'Không có sinh viên phù hợp với dự án' })
      }

      res.status(200).json({ project })
    }
    catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = new StudentController()
