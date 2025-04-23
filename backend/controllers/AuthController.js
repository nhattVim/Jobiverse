const User = require('../models/User');
const Student = require('../models/Student');
const Employer = require('../models/Employer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

class UserController {
  // [POST] /users/register
  async registerUser(req, res, next) {
    try {
      const { accountType, email, password, ...profileData } = req.body;

      // Tạo user
      const user = await User.create({ accountType, email, password });

      // Tùy theo loại tài khoản tạo hồ sơ tương ứng
      if (accountType === 'student') {
        await Student.create({ ...profileData, userID: user._id });
      } else if (accountType === 'employer') {
        await Employer.create({ ...profileData, userID: user._id });
      }

      res.status(201).json({ message: 'Tạo tài khoản thành công', userID: user._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản' });
    }
  }

  // [POST] /users/login
  async loginUser(req, res, next) {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    try {
      const { email, password } = req.body;

      // Tìm user theo email
      const user = await User.findOne({ email, deleted: false });
      if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });

      // Tạo JWT
      const token = jwt.sign(
        { userID: user._id, accountType: user.accountType },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Lưu token vào user (nếu bạn muốn)
      user.token = token;
      await user.save();

      res.json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user._id,
          email: user.email,
          accountType: user.accountType
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập' });
    }
  }
  // [POST] /users/logout
  async logoutUser(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      await User.findByIdAndUpdate(decoded.userID, { token: null });

      res.json({ message: 'Đăng xuất thành công' });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  }
}

module.exports = new UserController();
