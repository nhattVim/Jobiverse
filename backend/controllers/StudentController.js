const Student = require('../models/Student');

class StudentController {
  // [GET] /students
  getAllStudents(req, res, next) {
    Student.find().lean()
      .then(users => {
        res.status(200).json({
          users: users,
        });
      })
      .catch(next);
  }

  // [GET] /students/:id
  getStudentById(req, res, next) {
    const studentID = req.params.id;
    Student.findById(studentID)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
      })
      .catch(next);
  }

  // [POST] /students
  createStudent(req, res, next) {
    const newStudent = new Student(req.body);

    newStudent.save()
      .then(user => {
        res.status(201).json({
          message: 'User added successfully',
          user: user,
        });
      })
      .catch(next);
  }

  // [GET] /students/search
  searchStudents(req, res, next) {
    const { name, email } = req.query;

    const searchQuery = {};
    if (name) searchQuery.name = new RegExp(name, 'i');  // Tìm kiếm theo tên, không phân biệt hoa thường
    if (email) searchQuery.email = new RegExp(email, 'i');  // Tìm kiếm theo email

    Student.find(searchQuery)
      .then(students => {
        res.status(200).json({ students });
      })
      .catch(next);
  }

  // [PUT] /students/:id
  updateStudent(req, res, next) {
    const studentId = req.params.id;

    Student.findByIdAndUpdate(studentId, req.body, { new: true })
      .then(student => {
        if (!student) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
          message: 'User updated successfully',
          user: student,
        });
      })
      .catch(next);
  }

  // [DELETE] /students/:id
  deleteStudent(req, res, next) {
    const studentId = req.params.id;
    Student.findByIdAndDelete(studentId)
      .then(student => {
        if (!student) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
      })
      .catch(next);
  }
}

module.exports = new StudentController();