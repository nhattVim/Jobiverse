const Student = require('../models/Student');
const Major = require('../models/Major/Major');
const Specialization = require('../models/Major/Specialization');
class StudentController {
  // [GET] /students
  async getAllStudents(req, res, next) {
    try {
      const students = (await Student.find()
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        })).filter(student => student.account);
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách sinh viên', error: err.message });
    }
  }

  // [GET] /students/:id
  async getStudentById(req, res, next) {
    try {
      const student = await Student.findById(req.params.id)
        .select('-__v')
        .populate({
          path: 'account',
          match: { deleted: false },
          select: '-password -__v'
        });

      if (!student || !student.account) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên hoặc tài khoản đã bị xoá' });
      }

      res.status(200).json({ student });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin sinh viên', error: err.message });
    }
  }

  // [POST] /students
  async createStudentProfile(req, res, next) {
    try {
      const accountId = req.account._id;

      const existingStudent = await Student.findOne({ account: accountId });
      if (existingStudent) return res.status(400).json({ message: 'Tài khoản đã có hồ sơ student' });

      const student = await Student.create({ ...req.body, account: accountId });
      if (!student) return res.status(400).json({ message: 'Lỗi khi tạo hồ sơ sinh viên' });

      res.status(201).json({ message: 'Tạo hồ sơ student thành công', student });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo hồ sơ student', error: err.message });
    }
  }

  // [GET] /students/search
  async searchStudents(req, res, next) {
    try {
      const { mssv, name } = req.query;

      const searchQuery = {};
      if (mssv) searchQuery.mssv = new RegExp(mssv, 'i');
      if (name) searchQuery.name = new RegExp(name, 'i');

      const students = await Student.find(searchQuery)
        .select('-__v')
        .populate('account', '-password -__v');
 
      res.status(200).json({ students });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tìm kiếm sinh viên', error: err.message });
    }
  }

  // [PUT] /students
  async updateStudentProfile(req, res, next) {
    try {
      const accountId = req.account._id;
      const { mssv, name, major, interests, university, avatarURL } = req.body;
      const updatedStudent = await Student.findOneAndUpdate(
        { account: accountId },
        { mssv, name, major, interests, university, avatarURL },
        { new: true }
      );
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({ message: 'Student updated successfully', updatedStudent });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hồ sơ sinh viên', error: err.message });
    }
  }

    // [GET] /student/filter
      async filterStudent(req, res, next) {
        try {
          const majorName = req.query.major;
          const specializationName = req.query.specialization;
      
          if (!majorName) {
            return res.status(400).json({ message: 'Thiếu tên ngành (major)' });
          }
      
          const majorDoc = await Major.findOne({ name: new RegExp(majorName, 'i') });
          if (!majorDoc) {
            return res.status(404).json({ message: 'Không tìm thấy ngành' });
          }
      
          var filter = { major: majorDoc._id };
          var populateFields = ['major'];
      
          if (specializationName) {
            const specializationDoc = await Specialization.findOne({ name: new RegExp(specializationName, 'i') });
      
            if (!specializationDoc) {
              return res.status(404).json({ message: 'Không tìm thấy chuyên ngành' });
            }
            //thêm specialization vào filter hình dung : filter = { specialization: specializationDoc._id }
            filter.specialization = specializationDoc._id;
            populateFields.push('specialization');
          }
      
          const students = await Student.find(filter).populate(populateFields);
      
          if (!students.length) {
            return res.status(404).json({ message: 'Không có project nào phù hợp' });
          }
      
          res.status(200).json({ students });
      
        } catch (err) {
          res.status(500).json({ message: 'Lỗi server', error: err.message });
        }
      }
}

module.exports = new StudentController();