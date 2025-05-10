const CV = require('../models/CV');
const Account = require('../models/Account');
const Student = require('../models/Student');

class CVController {
  // [GET] /cv
  async getAllStudentCV(req, res, next) {
    try {
      const accountId = req.account._id;

      const student = await Account.findOne({ _id: accountId });
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

      const cvList = await CV.find({ student: student._id })
        .select('title desiredPosition lastUpdated')
        .sort({ lastUpdated: -1 });

      if (!cvList || cvList.length === 0) {
        return res.status(200).json({ message: 'Chưa có CV nào', cvs: [] });
      }

      res.status(200).json(cvList);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy CV', error: err.message });
    }
  }

  // [GET] /cv/:id
  async getStudentCV(req, res) {
    try {
      const accountId = req.account._id;
      const cvId = req.params.id;

      const student = await Account.findOne({ _id: accountId });
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

      const cv = await CV.findOne({ student: student._id, _id: cvId });
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' });
      res.status(200).json(cv);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy CV', error: err.message });
    }
  }

  // [POST] /cv
  async createStudentCV(req, res) {
    try {
      const accountId = req.account._id;
      const content = req.body;

      const student = await Account.findOne({ _id: accountId });
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

      const newCV = await CV.create({ student: student._id, ...content, lastUpdated: Date.now() });
      res.status(201).json({ message: 'Tạo CV thành công', newCV });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo CV ' + err.message, err: err.message });
    }
  }

  // [PUT] /cv
  async updateStudentCV(req, res) {
    try {
      const cvId = req.params.id;

      const cv = await CV.findByIdAndUpdate(cvId, { ...req.body, lastUpdated: Date.now() }, { new: true });
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' });

      res.status(200).json({ cv });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi xử lý CV ' + err.message, error: err.message });
    }
  }

  // [DELETE] /cv
  async deleteStudentCV(req, res) {
    try {
      const cvId = req.params.id;
      const cv = await CV.findByIdAndDelete(cvId);
      if (!cv) return res.status(404).json({ message: 'CV không tồn tại' });
      res.status(200).json({ message: 'Xoá CV thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi xoá CV', error: err.message });
    }
  }
}

module.exports = new CVController();
