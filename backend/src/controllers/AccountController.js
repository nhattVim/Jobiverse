const Account = require('../models/Account');

class AdminController {
  // [GET] /account
  async getAllAccount(req, res, next) {
    try {
      const accounts = await Account.find({ deleted: false });
      res.json(accounts);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách tài khoản', error: err.message });
    }
  }

  // [GET] /account/:id
  async getAccountById(req, res, next) {
    try {
      const account = await Account.findById(req.params.id);
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.json(account);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy tài khoản', error: err.message });
    }
  }

  // [GET] /account/deleted
  async getAllDeletedAccount(req, res, next) {
    try {
      const accounts = await Account.find({ deleted: true });
      res.json(accounts);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách tài khoản', error: err.message });
    }
  }

  // [DELETE] /account/:id
  async deleteAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndUpdate(req.params.id, { deleted: true });
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.json({ message: 'Xóa tài khoản thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi xóa tài khoản', error: err.message });
    }
  }

  // [DELETE] /account/force/:id
  async forceDeleteAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndDelete(req.params.id);
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.json({ message: 'Xóa vĩnh viễn tài khoản thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi xóa vĩnh viễn tài khoản', error: err.message });
    }
  }

  // [POST] /account/restore/:id
  async restoreAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndUpdate(req.params.id, { deleted: false });
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.json({ message: 'Khôi phục tài khoản thành công' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi khôi phục tài khoản', error: err.message });
    }
  }
}

module.exports = new AdminController();