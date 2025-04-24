const Student = require('../models/Student');

class StudentController {
  // [GET] /students
  async getAllStudents(req, res, next) {
    try {
      const students = (await Student.find().populate({
        path: 'account',
        match: { deleted: false },
        select: '-password'
      })).filter(student => student.account);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách sinh viên' });
    }
  }

  // [GET] /students/:id
  async getStudentById(req, res, next) {
    try {
      const student = await Student.findById(req.params.id).populate({
        path: 'account',
        match: { deleted: false },
        select: '-password'
      });

      if (!student || !student.account) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên hoặc tài khoản đã bị xoá' });
      }

      res.status(200).json({ student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi lấy thông tin sinh viên' });
    }
  }


  // [POST] /students
  async createStudentProfile(req, res, next) {
    try {
      const newStudent = new Student(req.body);
      newStudent.account = req.account;
      await newStudent.save();
      res.status(201).json({ message: 'Tạo hồ sơ student thành công', newStudent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi tạo hồ sơ student' });
    }
  }

  // [GET] /students/search
  async searchStudents(req, res, next) {
    try {
      const { mssv, name } = req.query;

      const searchQuery = {};
      if (mssv) searchQuery.mssv = new RegExp(mssv, 'i');
      if (name) searchQuery.name = new RegExp(name, 'i');

      const students = await Student.find(searchQuery).populate('account', '-password');
      res.status(200).json({ students });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tìm kiếm sinh viên' });
    }
  }

  // [PUT] /students/:id
  async updateStudentProfile(req, res, next) {
    try {
      const studentID = req.params.id;
      const { mssv, name, major, interests, university, avatarURL } = req.body;
      const updatedStudent = await Student.findByIdAndUpdate(
        studentID,
        { mssv, name, major, interests, university, avatarURL },
        { new: true }
      );
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({ message: 'Student updated successfully', updatedStudent });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hồ sơ sinh viên' });
    }
  }
}

module.exports = new StudentController();