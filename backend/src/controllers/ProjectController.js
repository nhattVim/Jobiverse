const Project = require('../models/Project')
const Employer = require('../models/Employer')
const Student = require('../models/Student')
const Account = require('../models/Account')
const Notification = require('../models/Notification')
const Major = require('../models/Major')
const Specialization = require('../models/Specialization')
const CV = require('../models/CV')
const CVUpload = require('../models/CVUpload')

class ProjectController {
  // [GET] /projects
  async getAllProjects(req, res, next) {
    try {
      const { major, spec, expRequired, workTypes, sortBy, search } = req.query

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

      const projects = await Project.find(filter)
        .sort(sort)
        .select('-__v')
        .populate({
          path: 'account',
          select: 'role avatar deleted'
        })

      const populatedProjects = await Promise.all(
        projects
          .filter((project) => project.account && !project.account.deleted)
          .map(async (project) => {
            if (!project.account) return project

            let profile = null

            if (project.account.role === 'student') {
              profile = await Student.findOne({ account: project.account._id })
                .select('name')
                .lean()
            } else if (project.account.role === 'employer') {
              profile = await Employer.findOne({ account: project.account._id })
                .select('companyName')
                .lean()
            }

            return {
              ...project.toObject(),
              profile
            }
          })
      )

      res.status(200).json(populatedProjects)
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error retrieving projects', error: err.message })
    }
  }

  // [GET] /projects/:id
  async getProjectById(req, res, next) {
    try {
      const projectId = req.params.id
      const project = await Project.findOne({ _id: projectId })
        .populate({
          path: 'account',
          select: 'role avatar deleted email'
        })
        .populate({
          path: 'applicants.student',
          select: '-__v',
          populate: {
            path: 'account',
            select: 'role avatar email'
          }
        })
        .select('-__v')
        .lean()

      if (!project) return res.status(404).json({ message: 'No project found' })

      project.applicants = project.applicants.filter(applicant => {
        return applicant.student && applicant.student.account !== null
      })

      if (!project.account || project.account.deleted) {
        return res.status(404).json({ message: 'Project owner not found or deleted' })
      }

      let profile = null
      if (project.account.role === 'student') {
        profile = await Student.findOne({ account: project.account._id })
          .select('name')
          .lean()
      } else if (project.account.role === 'employer') {
        profile = await Employer.findOne({ account: project.account._id })
          .select('companyName')
          .lean()
      }

      project.profile = profile

      res.status(200).json(project)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving project', error: err.message })
    }
  }

  // [GET] /projects/my
  async getProjects(req, res, next) {
    try {
      const accountId = req.account._id
      const projects = await Project.find({ account: accountId })
        .select('-__v')
        .sort({ createdAt: -1 })
      res.status(200).json(projects)
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error retrieving project', error: err.message })
    }
  }

  // [POST] /projects/my
  async createProject(req, res, next) {
    try {
      const accountId = req.account._id

      const project = await Project.create({ account: accountId, ...req.body })
      if (!project)
        return res.status(400).json({ message: 'Tạo dự án thất bại' })

      res.status(201).json(project)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi tạo dự án', error: err.message })
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

      if (!updatedProject)
        return res.status(404).json({ message: 'Dự án không tồn tại' })
      res.status(200).json(updatedProject)
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Lỗi cập nhật dự án', error: err.message })
    }
  }

  // [PUT] /projects/my/:id/status
  async updateProjectStatus(req, res, next) {
    try {
      const accountId = req.account._id
      const projectId = req.params.id
      const { status } = req.body

      const project = await Project.findOne({
        _id: projectId,
        account: accountId
      })
      if (!project)
        return res
          .status(404)
          .json({ message: 'Project not found or not owned by you' })

      if (!['open', 'closed', 'in-progress'].includes(status)) {
        return res.status(400).json({
          message:
            'Invalid status value. Must be "status": "open|closed|in-progress"'
        })
      }

      project.status = status
      await project.save()

      res
        .status(200)
        .json({ message: 'Project status updated successfully', project })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message })
    }
  }

  // [DELETE] /projects/my/:id
  async deleteProject(req, res, next) {
    try {
      const accountId = req.account._id
      const projectId = req.params.id

      const deletedProject = await Project.findOneAndDelete({
        _id: projectId,
        account: accountId
      })
      if (!deletedProject)
        return res.status(404).json({ message: 'Dự án không tồn tại' })

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
      const { cvId, coverLetter } = req.body

      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Project not found' })

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Student not found' })

      let cv = await CV.findOne({ _id: cvId, student: student._id })
      let cvType = 'CV'
      if (!cv) {
        cv = await CVUpload.findOne({ _id: cvId, student: student._id })
        if (!cv) return res.status(404).json({ message: 'CV not found' })
        cvType = 'CVUpload'
      }

      if (project.status !== 'open')
        return res.status(400).json({ message: 'Project is not open for applicants' })

      const existingApplicationIndex = project.applicants.findIndex(app =>
        app.student.toString() === student._id.toString()
      )

      if (existingApplicationIndex !== -1) {
        const existingApplication = project.applicants[existingApplicationIndex]

        if (existingApplication.status === 'rejected') {
          project.applicants[existingApplicationIndex] = {
            ...existingApplication.toObject(),
            status: 'pending',
            cv: cv._id,
            cvType,
            coverLetter
          }
        } else {
          return res.status(400).json({ message: 'Bạn đã ứng tuyển dự án này rồi' })
        }
      } else {
        project.applicants.push({
          student: student._id,
          cv: cv._id,
          coverLetter,
          cvType,
          status: 'pending'
        })
      }

      await project.save()

      await Notification.create({
        account: project.account,
        content: `Student "${student.name}" has applied to your project "${project.title}"`
      })

      res.status(200).json({ message: 'Application submitted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Server error: ' + err.message })
    }
  }

  // [GET] /projects/applied
  async getProjectsApplied(req, res, next) {
    try {
      const accountId = req.account._id
      const student = await Student.findOne({ account: accountId })
      if (!student)
        return res.status(404).json({ message: 'Student not found' })

      const projectsApplied = await Project.find({
        'applicants.student': student._id
      })
        .populate({
          path: 'account',
          select: 'role avatar'
        })
        .sort({ createdAt: -1 })

      const projectWithProfile = await Promise.all(
        projectsApplied.map(async (project) => {
          let profile = null
          if (project.account.role === 'student') {
            const student = await Student.findOne({
              account: project.account._id
            })
              .select('name')
              .lean()
            profile = student ? { name: student.name } : null
          } else if (project.account.role === 'employer') {
            const employer = await Employer.findOne({
              account: project.account._id
            })
              .select('companyName')
              .lean()
            profile = employer ? { companyName: employer.companyName } : null
          }

          return {
            ...project.toObject(),
            profile
          }
        })
      )
      res.status(200).json(projectWithProfile)
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message })
    }
  }

  // [DELETE] /projects/applied/:id
  async deleteAppliedProject(req, res, next) {
    try {
      const accountId = req.account._id
      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Student not found' })

      const projectId = req.params.id
      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Project not found' })

      // Remove the applicant from the applicants array
      const initialLength = project.applicants.length
      project.applicants = project.applicants.filter(
        (app) => app.student.toString() !== student._id.toString()
      )

      if (project.applicants.length === initialLength) {
        return res.status(404).json({ message: 'Application not found' })
      }

      await project.save()

      await Notification.create({
        account: project.account,
        content: `Ứng viên ${student.name} đã rút đơn ứng tuyển khỏi dự án "${project.title}".`
      })

      res.status(200).json({ message: 'Application deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message })
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

      const applicant = project.applicants.find(app => app.student.toString() === studentId)
      if (!applicant) return res.status(400).json({ message: 'Student did not apply for this project' })

      if (action === 'accept') {
        applicant.status = 'accepted'
      } else if (action === 'reject') {
        applicant.status = 'rejected'
      } else {
        return res.status(400).json({
          message: 'Invalid action. Must be "accept", "reject", or "assign"'
        })
      }

      await project.save()

      await Notification.create({
        account: project.account,
        content: `Your application for project "${project.title}" has been ${action}ed.`
      })

      res.status(200).json({ message: `Student has been ${action}ed successfully` })
    } catch (err) {
      res.status(500).json({ message: 'Server error' + err.message, error: err.message })
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

      const majorDoc = await Major.findOne({
        name: new RegExp(majorName, 'i')
      })
      if (!majorDoc) {
        return res.status(404).json({ message: 'Không tìm thấy ngành' })
      }

      var filter = { major: majorDoc._id }
      var populateFields = ['major']

      if (specializationName) {
        const specializationDoc = await Specialization.findOne({
          name: new RegExp(specializationName, 'i')
        })

        if (!specializationDoc) {
          return res
            .status(404)
            .json({ message: 'Không tìm thấy chuyên ngành' })
        }
        //thêm specialization vào filter hình dung : filter = { specialization: specializationDoc._id }
        filter.specialization = specializationDoc._id
        populateFields.push('specialization')
      }

      const projects = await Project.find(filter).populate(populateFields)

      if (!projects.length) {
        return res
          .status(404)
          .json({ message: 'Không có project nào phù hợp' })
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
      const majorIds = project.major.map((m) => m._id || m)
      const specializationIds = project.specialization.map((s) => s._id || s)

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
              $add: [
                { $multiply: ['$matchingMajors', 2] },
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
        return res
          .status(404)
          .json({ message: 'Không tìm thấy project tương tự' })
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
        return res
          .status(404)
          .json({ message: 'Không tìm thấy project phù hợp' })
      }

      res.status(200).json({ projects })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = new ProjectController()
