const Employer = require('../models/Employer');

class EmployerController {
  // [GET] /employers
  async getAllEmployers(req, res, next) {
    try {
      const employers = (await Employer.find()
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        })).filter(employer => employer.account)
      res.json(employers);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách employer', error: err.message });
    }
  }

  // [GET] /employers/:id
  async getEmployerById(req, res, next) {
    try {
      const employer = await Employer.findById(req.params.id)
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password'
        });

      if (!employer || !employer.account) {
        return res.status(404).json({ message: 'Không tìm thấy employer hoặc tài khoản đã bị xoá' });
      }

      res.status(200).json(employer);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin employer', error: err.message });
    }
  }

  // [POST] /employers
  async createEmployerProfile(req, res, next) {
    try {
      const accountId = req.account._id;

      const existingEmployer = await Employer.findOne({ account: accountId });
      if (existingEmployer) return res.status(400).json({ message: 'Tài khoản đã có hồ sơ employer' })

      const employer = await Employer.create({ ...req.body, account: accountId });
      if (!employer) return res.status(400).json({ message: 'Lỗi khi tạo hồ sơ employer' });

      res.status(201).json({ message: 'Tạo hồ sơ employer thành công', employer });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo employer', error: err.message });
    }
  }

  // [GET] /employers/search
  async searchEmployers(req, res, next) {
    try {
      const { companyName, representativeName } = req.query;

      const searchQuery = {};
      if (companyName) searchQuery.companyName = new RegExp(companyName, 'i');
      if (representativeName) searchQuery.representativeName = new RegExp(representativeName, 'i');

      const employers = await Employer.find(searchQuery)
        .select('-__v')
        .populate('account', '-password -__v');
      res.status(200).json({ employers });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tìm kiếm employer', error: err.message });
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
    catch (err) {
      res.status(500).json({ message: 'Lỗi khi cập nhật employer', error: err.message });
    }
  }
}

module.exports = new EmployerController();