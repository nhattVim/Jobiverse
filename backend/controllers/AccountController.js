const Account = require('../models/Account');

class AdminController {
  // [GET] /account
  async getAllAccount(req, res, next) {
    try {
      const accounts = await Account.find({ deleted: false });
      res.json(accounts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách tài khoản' });
    }
  }

  // [GET] /account/deleted
  async getAllDeletedAccount(req, res, next) {
    try {
      const accounts = await Account.find({ deleted: true });
      res.json(accounts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách tài khoản' });
    }
  }

  // [DELETE] /account/:id
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

  // [DELETE] /account/force/:id
  async forceDeleteAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndDelete(req.params.id);
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
      res.json({ message: 'Xóa vĩnh viễn tài khoản thành công' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ khi xóa vĩnh viễn tài khoản' });
    }
  }

  // [POST] /account/restore/:id
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

module.exports = new AdminController();