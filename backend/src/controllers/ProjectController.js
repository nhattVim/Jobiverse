const Project = require('../models/Project');
const Employer = require('../models/Employer');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

class ProjectController {
  // [GET] /projects
  async getAllProjects(req, res, next) {
    try {
      const projects = await Project.find({});
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving projects', error });
    }
  }

  // [GET] /projects/my
  async getProjects(req, res, next) {
    try {
      const accountId = req.account._id;

      const employer = await Employer.findOne({ account: accountId });
      if (!employer) {
        return res.status(404).json({ message: 'Employer not found' });
      }

      const projects = await Project.find({ employer: employer._id });
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
      }

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving project', error });
    }
  }

  // [POST] /projects/my
  async createProject(req, res, next) {
    try {
      const accountId = req.account._id;
      const {
        title,
        description,
        skillsRequired,
        benefits,
        workingTime
      } = req.body;

      const employer = await Employer.findOne({ account: accountId });
      if (!employer) {
        return res.status(404).json({ message: 'Employer không tồn tại' });
      }

      const newProject = new Project({
        employer: employer._id,
        title,
        description,
        skillsRequired,
        benefits,
        workingTime
      });

      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi tạo dự án', error });
    }
  }

  // [PUT] /projects/my/:id
  async updateProject(req, res, next) {
    try {
      const accountId = req.account._id;
      const projectId = req.params.id;

      const employer = await Employer.findOne({ account: accountId });
      if (!employer) return res.status(404).json({ message: 'Employer không tồn tại' });


      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, employer: employer._id },
        req.body,
        { new: true }
      );

      if (!updatedProject) {
        return res.status(404).json({ message: 'Dự án không tồn tại' });
      }

      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi cập nhật dự án', error });
    }
  }

  // [PUT] /projects//my/:id/status
  async updateProjectStatus(req, res, next) {
    try {
      const accountId = req.account._id;
      const projectId = req.params.id;
      const { status } = req.body;

      const employer = await Employer.findOne({ account: accountId });
      if (!employer) return res.status(404).json({ message: 'Employer không tồn tại' });

      const project = await Project.findOne({ _id: projectId, employer: employer._id });
      if (!project) return res.status(404).json({ message: 'Project not found or not owned by you' });

      if (!['open', 'closed', 'in-progress'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value. Must be "status": "open|closed|in-progress"' });
      }

      project.status = status;
      await project.save();

      res.status(200).json({ message: 'Project status updated successfully', project });
    } catch (error) {

    }
  }

  // [DELETE] /projects/my/:id
  async deleteProject(req, res, next) {
    try {
      const accountId = req.account._id;
      const projectId = req.params.id;

      const employer = await Employer.findOne({ account: accountId });
      if (!employer) {
        return res.status(404).json({ message: 'Employer không tồn tại' });
      }

      const deletedProject = await Project.findOneAndDelete({
        _id: projectId,
        employer: employer._id
      });

      if (!deletedProject) {
        return res.status(404).json({ message: 'Dự án không tồn tại' });
      }

      res.status(200).json({ message: 'Dự án đã được xóa thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi xóa dự án', error });
    }
  }

  // [POST] /projects/:projectId/apply
  async applyToProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const accountId = req.account._id;

      const student = await Student.findOne({ account: accountId });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.status !== 'open') {
        return res.status(400).json({ message: 'Project is not open for applications' });
      }

      if (project.applicants.includes(student._id)) {
        return res.status(400).json({ message: 'You have already applied to this project' });
      }

      if (project.assignedStudents.includes(student._id)) {
        return res.status(400).json({ message: 'You have already been assigned to this project' });
      }

      project.applicants.push(student._id);
      await project.save();

      const employer = await Employer.findById(project.employer).populate('account');
      if (employer && employer.account) {
        await Notification.create({
          account: employer.account._id,
          content: `Student ${student.account.name} has applied to your project ${project.title}`,
        })
      }

      res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  // [POST] /projects/:projectId/respond/:studentId
  async respondToApplication(req, res, next) {
    try {
      const { projectId, studentId } = req.params;
      const { action } = req.body;
      const accountId = req.account._id;

      const employer = await Employer.findOne({ account: accountId });
      if (!employer) {
        return res.status(404).json({ message: 'Employer not found' });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.employer.toString() !== employer._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to respond to this project' });
      }

      if (!project.applicants.includes(studentId)) {
        return res.status(400).json({ message: 'Student did not apply for this project' });
      }

      if (action === 'accept') {
        project.assignedStudents.push(studentId);
      } else if (action !== 'reject') {
        return res.status(400).json({ message: 'Invalid action. Must be "accept" or "reject"' });
      }

      project.applicants = project.applicants.filter(id => id.toString() !== studentId);
      await project.save();

      const student = await Student.findById(studentId).populate('account');
      if (student && student.account) {
        await Notification.create({
          account: student.account._id,
          content: `Your application for project "${project.title}" has been ${action}ed.`,
        });
      }

      res.status(200).json({ message: `Student has been ${action}ed successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
}

module.exports = new ProjectController();