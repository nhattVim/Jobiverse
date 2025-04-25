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
        { id: account._id, type: account.accountType },
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

  // [DELETE] /account/delete
  async deleteAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndUpdate(req.params.id, { deleted: true });
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.json({ message: 'Xóa tài khoản thành công' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ khi xóa tài khoản' });
    }
  }

  // [POST] /account/restore
  async restoreAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndUpdate(req.params.id, { deleted: false });
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.json({ message: 'Khôi phục tài khoản thành công' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ khi khôi phục tài khoản' });
    }
  }
}

module.exports = new AccountController();
