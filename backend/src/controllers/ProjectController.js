const Project = require('../models/Project')
const Employer = require('../models/Employer')
const Student = require('../models/Student')
const Account = require('../models/Account')
const Notification = require('../models/Notification')
const Major = require('../models/Major')
const Specialization = require('../models/Specialization')
const CV = require('../models/CV')
const CVUpload = require('../models/CVUpload')
const { getPagination, getPaginationMetadata, paginatedResponse } = require('../utils/pagination')

class ProjectController {
  // [GET] /projects
  async getAllProjects(req, res, next) {
    try {
      const { major, spec, expRequired, workTypes, sortBy, search } = req.query
      const pagination = getPagination(req.query)

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

      // Get total count for pagination
      const total = await Project.countDocuments(filter)

      const projects = await Project.find(filter)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
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

      res.status(200).json(paginatedResponse(populatedProjects, total, pagination))
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error retrieving projects', error: err.message })
    }
  }

  // [GET] /projects/detail/:id
  async getProjectById(req, res, next) {
    try {
      const projectId = req.params.id
      const applicantsPagination = getPagination(req.query)

      const project = await Project.findOne({ _id: projectId })
        .populate({
          path: 'account',
          select: '_id role avatar deleted email'
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

      let applicants = project.applicants.filter(applicant => {
        return applicant.student && applicant.student.account !== null
      })

      // Test pagination
      // if (process.env.NODE_ENV !== 'production') {
      //   applicants = Array(100).fill(applicants).flat()
      // }

      let pendingApplicants = applicants.filter(applicant => applicant.status === 'pending')
      const totalApplicants = pendingApplicants.length
      const pagedApplicants = pendingApplicants.slice(applicantsPagination.skip, applicantsPagination.skip + applicantsPagination.limit)

      if (!project.account || project.account.deleted) {
        return res.status(404).json({ message: 'Project owner not found or deleted' })
      }

      let profile = null
      if (project.account.role === 'student') {
        profile = await Student.findOne({ account: project.account._id })
          .select('name university major specialization')
          .populate({ path: 'major', select: 'name' })
          .populate({ path: 'specialization', select: 'name' })
          .lean()
      } else if (project.account.role === 'employer') {
        profile = await Employer.findOne({ account: project.account._id })
          .select('companyName businessScale industry address')
          .lean()
      }

      project.profile = profile
      project.applicants = applicants
      project.pendingApplicants = pagedApplicants
      project.applicantsPagination = getPaginationMetadata(totalApplicants, applicantsPagination.page, applicantsPagination.limit)

      res.status(200).json(project)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving project', error: err.message })
    }
  }

  // [GET] /projects/employer/:id
  async getProjectsByEmployer(req, res) {
    try {
      const accountId = req.params.id
      const projects = await Project.find({ account: accountId })
        .populate({
          path: 'account',
          select: 'role avatar deleted email'
        })
        .select('title location salary workType')
        .lean()

      const populatedProjects = await Promise.all(
        projects
          .filter((project) => project.account && !project.account.deleted)
          .map(async (project) => {
            let profile = null

            if (project.account.role === 'employer') {
              profile = await Employer.findOne({ account: project.account._id })
                .select('companyName')
                .lean()
            }

            return {
              ...project,
              profile
            }
          })
      )

      res.status(200).json(populatedProjects)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving projects', error: err.message })
    }
  }

  // [GET] /projects/latest
  async getProjectsLatest(req, res) {
    try {
      const projects = await Project.find({ status: 'open' })
        .sort({ salary: -1, createdAt: -1 })
        .limit(10)
        .populate({
          path: 'account',
          select: 'role avatar deleted'
        })
        .select('title location salary workType createdAt')
        .lean()

      const filteredProjects = projects.filter(p => p.account && !p.account.deleted)

      res.status(200).json(filteredProjects)
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving latest projects', error: err.message })
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

  // [GET] /projects/invitations
  async getProjectInvitations(req, res, next) {
    try {
      const accountId = req.account._id

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Student not found' })

      const studentId = student._id

      const projects = await Project.find({
        'applicants': {
          $elemMatch: {
            student: studentId,
            status: 'invited'
          }
        }
      })
        .populate('account', 'avatar role')
        .select('-__v')
        .sort({ createdAt: -1 })
        .lean()

      const filteredProjects = await Promise.all(
        projects.map(async (project) => {

          const applicants = project.applicants.filter(app =>
            app.student.toString() === studentId.toString() &&
            app.status === 'invited'
          )

          let profile = null
          if (project.account?.role === 'student') {
            const stu = await Student.findOne({ account: project.account._id }).select('name').lean()
            profile = stu ? { name: stu.name } : null
          } else if (project.account?.role === 'employer') {
            const emp = await Employer.findOne({ account: project.account._id }).select('companyName').lean()
            profile = emp ? { companyName: emp.companyName } : null
          }

          return {
            ...project,
            applicants,
            profile
          }
        })
      )

      res.json(filteredProjects)
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách lời mời', error: error.message })
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
      if (project.status !== 'open') return res.status(400).json({ message: 'Project is not open for applicants' })


      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Student not found' })

      let cv = await CV.findOne({ _id: cvId, student: student._id })
      let cvType = 'CV'
      if (!cv) {
        cv = await CVUpload.findOne({ _id: cvId, student: student._id })
        if (!cv) return res.status(404).json({ message: 'CV not found' })
        cvType = 'CVUpload'
      }

      const applicantIndex = project.applicants.findIndex((app) => app.student.toString() === student._id.toString())

      if (applicantIndex !== -1) {
        const existingApplication = project.applicants[applicantIndex]

        if (existingApplication.status === 'rejected') {
          project.applicants[applicantIndex] = {
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
        content: `Ứng viên "${student.name}" đã ứng tuyển vào dự án "${project.title}" của bạn`
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
      if (!student) return res.status(404).json({ message: 'Student not found' })

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
          if (project.account?.role === 'student') {
            const student = await Student.findOne({
              account: project.account?._id
            })
              .select('name')
              .lean()
            profile = student ? { name: student.name } : null
          } else if (project.account?.role === 'employer') {
            const employer = await Employer.findOne({
              account: project.account?._id
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
      res.status(500).json({ message: 'Server error' + err.message, error: err.message })
    }
  }

  // [DELETE] /projects/applied/:id
  async deleteAppliedProject(req, res, next) {
    try {
      const accountId = req.account._id
      const student = await Student.findOne({ account: accountId })
      if (!student)
        return res.status(404).json({ message: 'Student not found' })

      const projectId = req.params.id
      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Project not found' })

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
        return res.status(403).json({
          message: 'You are not authorized to respond to this project'
        })
      }

      const applicant = project.applicants.find((app) => app.student.toString() === studentId)
      if (!applicant) return res.status(400).json({ message: 'Student did not apply for this project' })

      if (action === 'accept') {
        applicant.status = 'accepted'
      } else if (action === 'reject') {
        if (applicant.status === 'pending') {
          applicant.status = 'rejected'
        } else if (applicant.status === 'invited') {
          project.applicants = project.applicants.filter((app) => app.student.toString() !== studentId)
        }
      } else {
        return res.status(400).json({
          message: 'Invalid action. Must be "accept", "reject", or "assign"'
        })
      }

      await project.save()

      const studentAccount = await Student.findById(studentId)
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        })

      if (studentAccount?.account) {
        await Notification.create({
          account: studentAccount.account,
          content: `Bạn đã ${action === 'accept' ? 'được chấp nhận' : 'bị từ chối'} vào dự án "${project.title}".`
        })
      }

      res.status(200).json({ message: `Student has been ${action}ed successfully` })
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Server error' + err.message, error: err.message })
    }
  }

  // [POST] /projects/:projectId/invite/:studentId
  async InviteStudentToProject(req, res, next) {
    const projectId = req.params.projectId
    const studentId = req.params.studentId
    const accountId = req.account._id

    try {
      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Project not found' })
      if (project.status !== 'open') return res.status(400).json({ message: 'Project is not open for applicants' })

      if (project.account.toString() !== accountId.toString()) {
        return res.status(403).json({
          message: 'You are not authorized to respond to this project'
        })
      }

      const student = await Student.findById(studentId).populate('defaultCV.cv')
      if (!student || !student.defaultCV.cv || !student.defaultCV.cv)
        return res.status(400).json({ message: 'Student or default CV not found' })

      const applicantIndex = project.applicants.findIndex((app) => app.student.toString() === student._id.toString())

      if (applicantIndex !== -1) {
        const existingApplication = project.applicants[applicantIndex]

        if (existingApplication.status === 'declinedInvitation') {
          project.applicants[applicantIndex] = {
            ...existingApplication.toObject(),
            status: 'invited',
            cv: student.defaultCV.cv._id,
            cvType: student.defaultCV.type
          }
        } else {
          return res.status(400).json({ message: 'Student has already applied or been invited to this project' })
        }
      } else {
        project.applicants.push({
          student: student._id,
          cv: student.defaultCV.cv._id,
          cvType: student.defaultCV.type,
          status: 'invited'
        })
      }

      await project.save()

      const account = await Account.findById(project.account)
      if (!account) return res.status(404).json({ message: 'Account not found' })

      let profile = null
      if (account.role === 'student') {
        profile = await Student.findOne({ account: account._id })
      } else if (account.role === 'employer') {
        profile = await Employer.findOne({ account: account._id })
      }

      const displayName = account.role === 'student'
        ? profile?.name || 'Sinh viên'
        : profile?.companyName || 'Nhà tuyển dụng'

      await Notification.create({
        account: student.account,
        content: `Bạn đã được "${displayName}" mời vào dự án "${project.title}".`
      })

      res.json({ message: 'Student invited successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' + error.message })
    }
  }

  // [POST] /projects/invitations/:projectId/:action
  async studentResponeInvitations(req, res, next) {
    const { projectId, action } = req.params
    const accountId = req.account._id

    try {
      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Project not found' })

      const student = await Student.findOne({ account: accountId })
      if (!student) return res.status(404).json({ message: 'Student not found' })

      const applicantIndex = project.applicants.findIndex((app) => app.student.toString() === student._id.toString())
      if (applicantIndex === -1) return res.status(404).json({ message: 'You have not been invited to this project' })

      const applicant = project.applicants[applicantIndex]
      if (applicant.status !== 'invited') return res.status(400).json({ message: 'You can only respond to invitations' })

      if (action === 'accept') {
        applicant.status = 'accepted'
      } else if (action === 'reject') {
        applicant.status = 'declinedInvitation'
      } else {
        return res.status(400).json({ message: 'Invalid action. Must be "accept" or "reject"' })
      }

      await project.save()

      const account = await Account.findById(project.account)
      if (!account) return res.status(404).json({ message: 'Account not found' })

      await Notification.create({
        account: account,
        content: `Ứng viên "${student.name}" đã ${action === 'accept' ? 'chấp nhận' : 'từ chối'} lời mời vào dự án "${project.title}" của bạn.`
      })

      res.status(200).json({ message: `You have ${action === 'accept' ? 'accepted' : 'rejected'} the invitation successfully` })
    } catch (error) {
      console.error('Error responding to invitation:', error)
      res.status(500).json({ message: 'Server error', error: error.message })
    }
  }

  // [DELETE] /projects/invited/:projectId/:studentId
  async deleteStudentInvited(req, res, next) {
    try {
      const { projectId, studentId } = req.params

      const [student, project] = await Promise.all([
        Student.findOne({ _id: studentId }),
        Project.findById(projectId)
      ])

      if (!student)
        return res.status(404).json({ message: 'Student not found' })

      if (!project)
        return res.status(404).json({ message: 'Project not found' })

      const initialLength = project.applicants.length
      project.applicants = project.applicants.filter(
        (app) => app.student.toString() !== student._id.toString()
      )

      if (project.applicants.length === initialLength) {
        return res.status(404).json({ message: 'Application not found' })
      }

      await project.save()

      const account = await Account.findById(project.account)
      if (!account) return res.status(404).json({ message: 'Account not found' })

      let profile = null
      if (account.role === 'student') {
        profile = await Student.findOne({ account: account._id })
      } else if (account.role === 'employer') {
        profile = await Employer.findOne({ account: account._id })
      }

      const displayName = account.role === 'student'
        ? profile?.name || 'Sinh viên'
        : profile?.companyName || 'Nhà tuyển dụng'

      await Notification.create({
        account: student.account,
        content: `"${displayName}" đã huỷ mời bạn vào dự án "${project.title}".`
      })

      res.status(200).json({ message: 'Application deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message })
    }
  }

  // [GET] /projects/rcm/:id
  async RcmProjectByProject(req, res, next) {
    try {
      const projectId = req.params.id
      const project = await Project.findById(projectId)
      if (!project) return res.status(404).json({ message: 'Không tồn tại project' })

      const majorIds = project.major.map((m) => m._id || m)
      const specializationIds = project.specialization.map((s) => s._id || s)

      const similarProjects = await Project.aggregate([
        {
          $match: {
            _id: { $ne: project._id },
            status: 'open',
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

      const projectIds = similarProjects.map(p => p._id)
      const populatedProjects = await Project.find({ _id: { $in: projectIds } })
        .populate({ path: 'major', select: '-__v' })
        .populate({ path: 'specialization', select: '-__v' })
        .populate({ path: 'account', select: 'role avatar deleted' })
        .lean()

      const filteredProject = populatedProjects.filter(p => p.account !== null)
      const result = projectIds.map(id => filteredProject.find(p => p._id.toString() === id.toString())).filter(Boolean)

      res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }

  // [GET] /projects/rcm/student/:id
  async RcmStudentByProject(req, res, next) {
    try {
      const projectId = req.params.id
      const project = await Project.findById(projectId)

      if (!project) return res.status(404).json({ message: 'Không tồn tại project' })

      const majorIds = project.major.map((m) => m._id || m)
      const specializationIds = project.specialization.map((s) => s._id || s)

      const similarStudents = await Student.aggregate([
        {
          $match: {
            $or: [
              { major: { $in: majorIds } },
              { specialization: { $in: specializationIds } }
            ]
          }
        },
        {
          $addFields: {
            matchingMajors: {
              $cond: [
                { $in: ['$major', majorIds] },
                1,
                0
              ]
            },
            matchingSpecializations: {
              $cond: [
                { $in: ['$specialization', specializationIds] },
                1,
                0
              ]
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

      const studentIds = similarStudents.map((s) => s._id)
      const populatedStudents = await Student.find({ _id: { $in: studentIds } })
        .populate('major')
        .populate('specialization')
        .populate('account', '-password -__v')
        .populate('defaultCV.cv')
        .lean()

      const filteredStudents = populatedStudents.filter(student => student.account !== null)
      const result = studentIds.map(id => filteredStudents.find(s => s._id.toString() === id.toString())).filter(Boolean)

      return res.status(200).json(result)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message })
    }
  }
}

module.exports = new ProjectController()
