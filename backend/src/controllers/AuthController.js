const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

class AccountController {
  // [POST] /account/register
  async registerAccount(req, res, next) {
    try {
      const { accountType, email, password, ...profileData } = req.body;
      const account = await Account.create({ accountType, email, password });
      res.status(201).json({ message: 'Tạo tài khoản thành công', accountID: account._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản' });
    }
  }

  // [POST] /account/login
  async loginAccount(req, res, next) {
    try {
      const { email, password } = req.body;

      const account = await Account.findOne({ email, deleted: false });
      if (!account) return res.status(404).json({ message: 'Email không tồn tại' });

      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });

      const token = jwt.sign(
        { id: account._id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        message: 'Đăng nhập thành công',
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

  // [POST] /logout
  async logoutAccount(req, res, next) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      res.json({ message: 'Đăng xuất thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi đăng xuất' });
    }
  }
}

module.exports = new AccountController();
