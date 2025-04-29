const CV = require('../models/student/CV');
const Student = require('../models/Student');

class CVController {
  // [GET] /cv
  async getStudentCV(req, res, next) {
    try {
      const accountId = req.account._id;
      const student = await Student.findOne({ account: accountId });

      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

      const cv = await CV.findOne({ student: student._id });

      if (!cv) return res.status(404).json({ message: 'Chưa có CV' });

      res.status(200).json({ cv });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy CV' });
    }
  }

  // [PUT] /cv
  async updateStudentCV(req, res) {
    try {
      const accountId = req.account._id;
      const { content } = req.body;

      const student = await Student.findOne({ account: accountId });
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
      }

      const existingCV = await CV.findOne({ student: student._id });

      let message;
      let updatedCV;

      if (existingCV) {
        updatedCV = await CV.findByIdAndUpdate(
          existingCV._id,
          { content, lastUpdated: Date.now() },
          { new: true }
        );
        message = 'Cập nhật CV thành công';
      } else {
        updatedCV = await CV.create({
          student: student._id,
          content,
          lastUpdated: Date.now()
        });
        message = 'Tạo CV mới thành công';
      }

      res.status(200).json({ message, cv: updatedCV });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi xử lý CV' });
    }
  }


  // [DELETE] /cv
  async deleteStudentCV(req, res) {
    try {
      const accountId = req.account._id;
      const student = await Student.findOne({ account: accountId });

      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });

      const result = await CV.findOneAndDelete({ student: student._id });

      if (!result) return res.status(404).json({ message: 'CV không tồn tại' });

      res.status(200).json({ message: 'Xoá CV thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xoá CV' });
    }
  }
}

module.exports = new CVController();