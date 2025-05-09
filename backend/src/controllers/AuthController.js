const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

class AccountController {
  // [POST] /register
  async registerAccount(req, res, next) {
    try {
      const { accountType, email, password, phoneNumber } = req.body;

      const trimmedEmail = email?.trim();
      const trimmedPhone = phoneNumber?.trim();

      if (!trimmedEmail || !trimmedPhone || !password || !accountType) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
      }

      const emailExists = await Account.findOne({ email: trimmedEmail, deleted: false });
      if (emailExists) return res.status(400).json({ message: 'Email đã được sử dụng' });

      const phoneExists = await Account.findOne({ phoneNumber: trimmedPhone, deleted: false });
      if (phoneExists) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });

      const account = await Account.create({ accountType, email, password, phoneNumber });
      res.status(201).json({ message: 'Tạo tài khoản thành công', accountID: account._id });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản', error: err.message });
    }
  }

  // [POST] /login
  async loginAccount(req, res, next) {
    try {
      const { emailOrPhone, password } = req.body;

      if (!emailOrPhone || !password) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
      }

      const isEmail = emailOrPhone.includes('@');
      let account;

      if (isEmail) {
        account = await Account.findOne({ deleted: false, email: emailOrPhone, });
      } else {
        account = await Account.findOne({ deleted: false, phoneNumber: emailOrPhone, });
      }

      if (!account) return res.status(404).json({ message: 'Email hoặc số điện thoại không tồn tại' });

      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });

      const token = jwt.sign(
        { id: account._id, type: account.accountType },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ message: 'Đăng nhập thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập', error: err.message });
    }
  }

  // [POST] /logout
  async logoutAccount(req, res, next) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      res.json({ message: 'Đăng xuất thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi đăng xuất', error: err.message });
    }
  }
}

module.exports = new AccountController();
