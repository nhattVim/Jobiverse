const Employer = require('../models/Employer');

class EmployerController {
  // [GET] /employers
  async getAllEmployers(req, res, next) {
    try {
      const employers = (await Employer.find().populate({
        path: 'account',
        match: { deleted: false },
        select: '-password'
      })).filter(student => student.account)
      res.json(employers);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách employer' });
    }
  }

  // [GET] /employers/:id
  async getEmployerById(req, res, next) {
    try {
      const employer = await Employer.findById(req.params.id).populate({
        path: 'account',
        match: { deleted: false },
        select: '-password'
      });

      if (!employer || !employer.account) {
        return res.status(404).json({ message: 'Không tìm thấy employer hoặc tài khoản đã bị xoá' });
      }
      res.status(200).json(employer);
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

  // [PUT] /employers
  async updateEmployerProfile(req, res, next) {
    try {
      const accountId = req.account._id;
      const { companyName, representativeName, position, industry, companyInfo } = req.body;
      const updatedEmployer = await Employer.findOneAndUpdate(
        { account: accountId },
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
}

module.exports = new EmployerController();