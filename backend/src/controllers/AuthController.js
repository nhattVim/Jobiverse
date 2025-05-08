const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

class AccountController {
  // [POST] /register
  async registerAccount(req, res, next) {
    try {
      const { accountType, email, password, phoneNumber } = req.body;

      const existingAccount = await Account.findOne({ email });
      if (existingAccount) return res.status(400).json({ message: 'Email đã được sử dụng' });

      const existingAccount2 = await Account.findOne({ phoneNumber });
      if (existingAccount2) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });

      const account = await Account.create({ accountType, email, password, phoneNumber });
      res.status(201).json({ message: 'Tạo tài khoản thành công', accountID: account._id });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản', error: err.message });
    }
  }

  // [POST] /login
  async loginAccount(req, res, next) {
    try {
      const { email, phoneNumber, password } = req.body;

      let account;

      if (email) {
        account = await Account.findOne({ email, deleted: false });
        if (!account) return res.status(404).json({ message: 'Email không tồn tại' });
      } else if (phoneNumber) {
        account = await Account.findOne({ phoneNumber, deleted: false });
        if (!account) return res.status(404).json({ message: 'Số điện thoại không tồn tại không tồn tại' });
      }

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
