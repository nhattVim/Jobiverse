const User = require('../models/Users');

class UserController {
  // [GET] /users
  getAllUsers(req, res, next) {
    User.find().lean()
      .then(users => {
        res.status(200).json({
          users: users,
        });
      })
      .catch(next);
  }

  // [GET] /users/:id
  getUserById(req, res, next) {
    const userId = req.params.id;
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
      })
      .catch(next);
  }

  // [POST] /users
  createUser(req, res, next) {
    const { name, email, password } = req.body;
    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.save()
      .then(user => {
        res.status(201).json({
          message: 'User added successfully',
          user: user,
        });
      })
      .catch(next);
  }

  // [PUT] /users/:id
  updateUser(req, res, next) {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    User.findByIdAndUpdate(userId, { name, email, password }, { new: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
          message: 'User updated successfully',
          user: user,
        });
      })
      .catch(next);
  }

  // [DELETE] /users/:id
  deleteUser(req, res, next) {
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
      })
      .catch(next);
  }

  // [GET] /users/search
  searchUsers(req, res, next) {
    const { name, email } = req.query;

    const searchQuery = {};
    if (name) searchQuery.name = new RegExp(name, 'i');  // Tìm kiếm theo tên, không phân biệt hoa thường
    if (email) searchQuery.email = new RegExp(email, 'i');  // Tìm kiếm theo email

    User.find(searchQuery)
      .then(users => {
        res.status(200).json({ users });
      })
      .catch(next);
  }

  // [POST] /users/register
  registerUser(req, res, next) {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.save()
      .then(user => {
        res.status(201).json({
          message: 'User registered successfully',
          user: user,
        });
      })
      .catch(next);
  }

  // [POST] /users/login
  loginUser(req, res, next) {
    const { email, password } = req.body;

    User.findOne({ email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
          return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({
          message: 'Login successful',
          user: user,
          token: 'jwt-token',
        });
      })
      .catch(next);
  }
}

module.exports = new UserController();
