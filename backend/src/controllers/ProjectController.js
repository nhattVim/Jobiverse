const Project = require('../models/Project')
const Employer = require('../models/Employer')
const Student = require('../models/Student')
const Account = require('../models/Account')
const Notification = require('../models/Notification')
const Major = require('../models/Major')
const Specialization = require('../models/Specialization')

class ProjectController {
  // [GET] /projects
  async getAllProjects(req, res, next) {
    try {
      const {
        major,
        spec,
        expRequired,
        workTypes,
        sortBy,
        search
      } = req.query

      const filter = {}
      if (major) filter.major = { $in: major.split(',') }
      if (spec) filter.specialization = { $in: spec.split(',') }
      if (expRequired) filter.expRequired = { $in: expRequired.split(',') }
      if (workTypes) filter.workType = { $in: workTypes.split(',') }
      if (search) {
        const regex = new RegExp(search, 'i')
        filter.$or = [
          { title: regex },
          { description: regex },
          { 'location.province': regex },
          { 'location.district': regex },
          { 'location.ward': regex }
        ]
      }

      let sort = {}
      if (sortBy === 'newest') sort = { createdAt: -1 }
      else if (sortBy === 'oldest') sort = { createdAt: 1 }
      else if (sortBy === 'salaryDesc') sort = { salary: -1 }
      else if (sortBy === 'salaryAsc') sort = { salary: 1 }

      const projects = await Project.find(filter).sort(sort).select('-__v')
        .populate({
          path: 'account',
          select: 'role avatar deleted'
        })

      const populatedProjects = await Promise.all(
        projects
          .filter(project => project.account && !project.account.deleted)
          .map(async (project) => {
            if (!project.account) return project

            let profile = null

            if (project.account.role === 'student') {
              profile = await Student.findOne({ account: project.account._id }).select('name').lean()
            } else if (project.account.role === 'employer') {
              profile = await Employer.findOne({ account: project.account._id }).select('companyName').lean()
            }

            return {
              ...project.toObject(),
              profile
            }
          })
      )

      res.status(200).json(populatedProjects)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving projects', error: err.message })
    }
  }

  // [GET] /projects/my
  async getProjects(req, res, next) {
    try {
      const accountId = req.account._id
      const projects = await Project.find({ account: accountId }).select('-__v').sort({ createdAt: -1 })
      res.status(200).json(projects)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving project', error: err.message })
    }
  }

  // [POST] /projects/my
  async createProject(req, res, next) {
    try {
      const accountId = req.account._id

      const project = await Project.create({ account: accountId, ...req.body })
      if (!project) return res.status(400).json({ message: 'Tạo dự án thất bại' })

      res.status(201).json(project)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi tạo dự án', error: err.message })
    }
  }

  // [GET] /projects/my/:id
  async getProjectById(req, res, next) {
    try {
      const projectId = req.params.id
      const accountId = req.account._id
      if (!accountId) return res.status(401).json({ message: 'Unauthorized' })
      const project = await Project.findOne({ _id: projectId, account: accountId }).select('-__v')
      if (!project) return res.status(404).json({ message: 'No project found' })
      console.log(project)
      res.status(200).json(project)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving project', error: err.message })
    }
  }

  // [PUT] /projects/my/:id
  async updateProject(req, res, next) {
    try {
      const accountId = req.account._id
      const projectId = req.params.id

      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, account: accountId },
        req.body,
        { new: true }
      )

      if (!updatedProject) return res.status(404).json({ message: 'Dự án không tồn tại' })
      res.status(200).json(updatedProject)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi cập nhật dự án', error: err.message })
    }
  }

  // [PUT] /projects/my/:id/status
  async updateProjectStatus(req, res, next) {
    try {
      const accountId = req.account._id
      const projectId = req.params.id
      const { status } = req.body

      const project = await Project.findOne({ _id: projectId, account: accountId })
      if (!project) return res.status(404).json({ message: 'Project not found or not owned by you' })

      if (!['open', 'closed', 'in-progress'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value. Must be "status": "open|closed|in-progress"' })
      }

      project.status = status
      await project.save()

      res.status(200).json({ message: 'Project status updated successfully', project })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message })
    }
  }

  // [DELETE] /projects/my/:id
  async deleteProject(req, res, next) {
    try {
      const accountId = req.account._id
      const projectId = req.params.id

      const deletedProject = await Project.findOneAndDelete({ _id: projectId, account: accountId })
      if (!deletedProject) return res.status(404).json({ message: 'Dự án không tồn tại' })

      res.status(200).json({ message: 'Dự án đã được xóa thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi xóa dự án', error: err.message })
    }
  }

  // [POST] /projects/:projectId/apply
  async applyToProject(req, res, next) {
    try {
      const { projectId } = req.params
      const accountId = req.account._id

      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Project not found' })

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Student not found' })

      if (project.status !== 'open')
        return res.status(400).json({ message: 'Project is not open for applications' })

      if (project.applicants.includes(student._id))
        return res.status(400).json({ message: 'You have already applied to this project' })

      if (project.assignedStudents.includes(student._id))
        return res.status(400).json({ message: 'You have already been assigned to this project' })

      project.applicants.push(student._id)
      await project.save()

      await Notification.create({
        account: project.account,
        content: `Student ${student.account.name} has applied to your project ${project.title}`
      })

      res.status(200).json({ message: 'Application submitted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Server error', err: err.message })
    }
  }

  // [POST] /projects/:projectId/respond/:studentId
  async respondToApplication(req, res, next) {
    try {
      const { projectId, studentId } = req.params
      const { action } = req.body
      const accountId = req.account._id

      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Project not found' })

      const account = await Account.findById(accountId)
      if (!account) return res.status(404).json({ message: 'Account không tồn tại' })

      if (project.account.toString() !== account._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to respond to this project' })
      }

      if (!project.applicants.includes(studentId)) {
        return res.status(400).json({ message: 'Student did not apply for this project' })
      }

      if (action === 'accept') {
        project.assignedStudents.push(studentId)
      } else if (action !== 'reject') {
        return res.status(400).json({ message: 'Invalid action. Must be "accept" or "reject"' })
      }

      project.applicants = project.applicants.filter(id => id.toString() !== studentId)
      await project.save()

      const student = await Student.findById(studentId)
      if (!student) return res.status(404).json({ message: 'Student not found' })

      await Notification.create({
        account: student.account._id,
        content: `Your application for project "${project.title}" has been ${action}ed.`
      })

      res.status(200).json({ message: `Student has been ${action}ed successfully` })
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message })
    }
  }

  // [GET] /projects/search
  async searchProjectsByMajorName(req, res, next) {
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

      const projects = await Project.find(filter).populate(populateFields)

      if (!projects.length) {
        return res.status(404).json({ message: 'Không có project nào phù hợp' })
      }

      res.status(200).json({ projects })

    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }


  //recommend projects by projectId
  async RcmProjectByProject(req, res, next) {
    try {
      const projectId = req.params.id
      const project = await Project.findById(projectId)

      if (!project) {
        return res.status(404).json({ message: 'Không tồn tại project' })
      }

      // Lấy danh sách ID ngành và chuyên ngành
      const majorIds = project.major.map(m => m._id || m)
      const specializationIds = project.specialization.map(s => s._id || s)

      // Aggregation pipeline
      const projects = await Project.aggregate([
        {
          $match: {
            _id: { $ne: project._id },
            // kiểm tra 1 trong 2 điều kiện
            $or: [
              { major: { $in: majorIds } },
              { specialization: { $in: specializationIds } }
            ]
          }
        },
        {
          $addFields: {
            matchingMajors: {
              $size: {
                $filter: {
                  input: '$major',
                  as: 'm',
                  cond: { $in: ['$$m', majorIds] }
                }
              }
            },
            matchingSpecializations: {
              $size: {
                $filter: {
                  input: '$specialization',
                  as: 's',
                  cond: { $in: ['$$s', specializationIds] }
                }
              }
            }
          }
        },
        {
          $addFields: {
            score: {
              $add: [{ $multiply: ['$matchingMajors', 2] },
                '$matchingSpecializations'
              ]
            }
          }
        },
        {
          $sort: { score: -1 }
        }
      ])

      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy project tương tự' })
      }

      await Project.populate(projects, [
        { path: 'major', select: '-__v' },
        { path: 'specialization', select: '-__v' }
      ])

      res.status(200).json({ projects })

    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }


  //recommend projects by studentId
  async RcmProjectByStudent(req, res, next) {
    try {
      const studentId = req.params.id
      const student = await Student.findById(studentId) // Sửa lại: tìm Student chứ không phải Project

      if (!student) {
        return res.status(404).json({ message: 'Sinh viên không tồn tại' })
      }

      // Lấy danh sách ngành và chuyên ngành của sinh viên
      const majorId = student.major._id
      const specializationId = student._id

      const projects = await Project.aggregate([
        {
          $match: {
            major: majorId // chỉ lấy project có ngành giống
          }
        },
        {
          $addFields: {
            specializationMatch: {
              $cond: [
                { $in: [specializationId, '$specialization'] }, // nếu specializationId nằm trong project.specialization
                1, // khớp
                0 // không khớp
              ]
            }
          }
        },
        {
          $sort: { specializationMatch: -1 } // Ưu tiên project có chuyên ngành trùng
        }
      ])

      // Populate sau aggregate
      await Project.populate(projects, [
        { path: 'major', select: '-__v' },
        { path: 'specialization', select: '-__v' }
      ])

      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy project phù hợp' })
      }

      res.status(200).json({ projects })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = new ProjectController()
