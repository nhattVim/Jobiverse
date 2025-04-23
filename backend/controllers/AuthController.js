const Account = require('../models/Account');
const Student = require('../models/Student');
const Employer = require('../models/Employer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
  // [POST] /auth/register
  async registerUser(req, res, next) {
    try {
      const { accountType, email, password, ...profileData } = req.body;

      const account = await Account.create({ accountType, email, password });

      if (accountType === 'student') {
        await Student.create({ ...profileData, account: account._id });
      } else if (accountType === 'employer') {
        await Employer.create({ ...profileData, account: account._id });
      }

      res.status(201).json({ message: 'Tạo tài khoản thành công', accountID: account._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản' });
    }
  }

  // [POST] /auth/login
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const account = await Account.findOne({ email, deleted: false });
      if (!account) return res.status(404).json({ message: 'Email không tồn tại' });

      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });

      const token = jwt.sign(
        { accountID: account._id, accountType: account.accountType },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Đăng nhập thành công',
        token,
        account: {
          id: account._id,
          email: account.email,
          accountType: account.accountType,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập' });
    }
  }
}

module.exports = new AuthController();
