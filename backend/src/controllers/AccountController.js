const Account = require('../models/Account')
const Student = require('../models/Student')
const Employee = require('../models/Employer')
const bcrypt = require('bcryptjs')

class AdminController {
  // [GET] /account
  async getAllAccount(req, res, next) {
    try {
      const accounts = await Account.find({ deleted: false }).select('-password -__v')
      res.json(accounts)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách tài khoản', error: err.message })
    }
  }

  // [GET] /account/:id
  async getAccountById(req, res, next) {
    try {
      const account = await Account.findById(req.params.id).select('-password -__v')
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })
      res.json(account)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy tài khoản', error: err.message })
    }
  }

  // [GET] /account/deleted
  async getAllDeletedAccount(req, res, next) {
    try {
      const accounts = await Account.find({ deleted: true }).select('-password -__v')
      res.json(accounts)
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách tài khoản', error: err.message })
    }
  }

  // [GET] /detail
  async getAccountDetail(req, res, next) {
    try {
      const account = await Account.findById(req.account._id).select('-password -__v -deleted')
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })
      res.json(account)
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin tài khoản', error: err.message })
    }
  }

  // [GET] /account
  async getAvatar(req, res, next) {
    try {
      const account = await Account.findById(req.account._id).select('-password -__v -deleted')
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })

      let avatar = null

      if (account.accountType === 'student') {
        const student = await Student.findOne({ account: account._id })
        avatar = student?.avatar || null
      } else if (account.accountType === 'employer') {
        const employer = await Employee.findOne({ account: account._id })
        avatar = employer?.avatar || null
      }

      const result = account.toObject()
      result.avatar = avatar

      res.set('Content-Type', 'image/png')
      res.status(200).send(avatar)
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin tài khoản', error: err.message })
    }
  }

  // [DELETE] /account/:id
  async deleteAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndUpdate(req.params.id, { deleted: true })
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })
      res.json({ message: 'Xóa tài khoản thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi xóa tài khoản', error: err.message })
    }
  }

  // [DELETE] /account/force/:id
  async forceDeleteAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndDelete(req.params.id)
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })
      res.json({ message: 'Xóa vĩnh viễn tài khoản thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi xóa vĩnh viễn tài khoản', error: err.message })
    }
  }

  // [POST] /account/restore/:id
  async restoreAccount(req, res, next) {
    try {
      const account = await Account.findByIdAndUpdate(req.params.id, { deleted: false })
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })
      res.json({ message: 'Khôi phục tài khoản thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi khôi phục tài khoản', error: err.message })
    }
  }

  // [PUT] /account/:id
  async changePassword(req, res, next) {
    try {
      const account = await Account.findById(req.account._id)
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })

      const { oldPassword, newPassword } = req.body
      if (!oldPassword || !newPassword)
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu cũ và mật khẩu mới' })

      const isMatch = await bcrypt.compare(oldPassword, account.password)
      if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng.' })

      account.password = newPassword
      await account.save()

      res.json({ message: 'Đổi mật khẩu thành công.' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi thay đổi mật khẩu', error: err.message })
    }
  }
}

module.exports = new AdminController()
