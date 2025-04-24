const Employer = require('../models/Employer');

class EmployerController {
  // [GET] /employers
  async getAllEmployers(req, res, next) {
    try {
      const employers = await Employer.find().populate('account', '-password');
      res.json(employers);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách employer' });
    }
  }

  // [GET] /employers/:id
  async getEmployerById(req, res, next) {
    try {
      const employers = await Employer.findById(req.params.id).populate('account', '-password');
      res.json(employers);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin employer' });
    }
  }

  // [POST] /employers
  async createEmployerProfile(req, res, next) {
    try {
      const newEmployer = new Employer(req.body);
      newEmployer.account = req.account;
      newEmployer.save();
      res.status(201).json({ message: 'Tạo hồ sơ employer thành công', newEmployer });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo employer' });
    }
  }

  // [GET] /employers/search
  async searchEmployers(req, res, next) {
    try {
      const { companyName, representativeName } = req.query;

      const searchQuery = {};
      if (companyName) searchQuery.companyName = new RegExp(companyName, 'i');
      if (representativeName) searchQuery.representativeName = new RegExp(representativeName, 'i');

      const employers = await Employer.find(searchQuery).populate('account', '-password');
      res.status(200).json({ employers });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tìm kiếm employer' });
    }
  }

  // [PUT] /employers/:id
  async updateEmployerProfile(req, res, next) {
    try {
      const employerId = req.params.id;
      const { companyName, representativeName, position, industry, companyInfo } = req.body;
      const updatedEmployer = await Employer.findByIdAndUpdate(
        employerId,
        { companyName, representativeName, position, industry, companyInfo },
        { new: true }
      );
      if (!updatedEmployer) {
        return res.status(404).json({ message: 'Employer not found' });
      }
      res.status(200).json({ message: 'Employer updated successfully', updatedEmployer });
    }
    catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật employer' });
    }
  }

  // [DELETE] /employers/:id
  deleteEmployer(req, res, next) {
    const employerId = req.params.id;
    Employer.findByIdAndDelete(employerId)
      .then(employer => {
        if (!employer) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
      })
      .catch(next);
  }
}

module.exports = new EmployerController();