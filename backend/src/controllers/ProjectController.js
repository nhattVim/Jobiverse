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
      const projects = await Project.find()
        .select('-__v')
        .populate({
          path: 'account',
          select: 'accountType'
        })

      const populatedProjects = await Promise.all(
        projects.map(async (project) => {
          if (!project.account) return project

          let profile = null

          if (project.account.accountType === 'student') {
            profile = await Student.findOne({ account: project.account._id }).select('name avatar')
          } else if (project.account.accountType === 'employer') {
            profile = await Employer.findOne({ account: project.account._id }).select('companyName avatar')
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
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' })
      }

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

  async recommendProject(req, res, next) {
    try {
      const projectId = req.params.id
      const project = await Project.findById(projectId)
      if (!project) {
        return res.status(404).json({ message: 'Không tồn tại project' })
      }
      const majorId = project.major._id
      const specializationId = project.specialization._id
      const projects = await Project.find({
        _id: { $ne: projectId }, // loại trừ chính project này
        major: majorId,
        specialization: specializationId
      })
        .select('-__v')
        .populate('major', '-__v')
        .populate('description', '-__v')
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy project tương tự' })
      }

      res.status(200).json({ projects })
    }
    catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }


}

module.exports = new ProjectController()
