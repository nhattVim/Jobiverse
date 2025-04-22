const Employer = require('../models/Employer');

class EmployerController {
  // [GET] /employers
  getAllEmployers(req, res, next) {
    Employer.find().lean()
      .then(employers => {
        res.status(200).json({
          employers
        });
      })
      .catch(next);
  }

  // [GET] /employers/:id
  getEmployerById(req, res, next) {
    const employerID = req.params.id;
    Employer.findById(employerID)
      .then(employer => {
        if (!employer) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: employer });
      })
      .catch(next);
  }

  // [POST] /employers
  createEmployer(req, res, next) {
    const newEmployer = new Employer(req.body);

    newEmployer.save()
      .then(employer => {
        res.status(201).json({
          message: 'User added successfully',
          employer
        });
      })
      .catch(next);
  }

  // [GET] /students/search
  searchEmployers(req, res, next) {
    const { name, email } = req.query;

    const searchQuery = {};
    if (name) searchQuery.name = new RegExp(name, 'i');  // Tìm kiếm theo tên, không phân biệt hoa thường
    if (email) searchQuery.email = new RegExp(email, 'i');  // Tìm kiếm theo email

    Employer.find(searchQuery)
      .then(employers => {
        res.status(200).json({ employers });
      })
      .catch(next);
  }

  // [PUT] /employers/:id
  updateEmployer(req, res, next) {
    const employerId = req.params.id;

    Employer.findByIdAndUpdate(employerId, req.body, { new: true })
      .then(employer => {
        if (!employer) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
          message: 'User updated successfully',
          user: employer,
        });
      })
      .catch(next);
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