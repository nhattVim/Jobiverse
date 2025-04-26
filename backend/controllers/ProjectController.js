const Project = require('../models/Project');
const Employer = require('../models/Employer');

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
  async getProjectsByToken(req, res, next) {
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
      if (!employer) {
        return res.status(404).json({ message: 'Employer không tồn tại' });
      }

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
}

module.exports = new ProjectController();