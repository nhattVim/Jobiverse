const Account = require('../models/Account')
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const Employer = require('../models/Employer')

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

      let name = null

      if (account.role === 'student') {
        const student = await Student.findOne({ account: account._id })
        name = student?.name || null
      } else if (account.role === 'employer') {
        const employer = await Employer.findOne({ account: account._id })
        name = employer?.companyName || null
      }

      const accountObj = account.toObject()
      accountObj.name = name

      res.json(accountObj)
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin tài khoản', error: err.message })
    }
  }

  // [GET] /avatar
  async getAvatar(req, res, next) {
    try {
      const account = await Account.findById(req.account._id).select('-password -__v -deleted')
      if (!account || !account.avatar) return res.status(404).json({ message: 'Tài khoản không tồn tại' })

      if (account.avatar && account.avatar.data) {
        res.set('Content-Type', account.avatar.contentType)
        return res.status(200).send(account.avatar.data)
      }

      return res.status(404).json({ message: 'Không có ảnh đại diện' })
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin tài khoản', error: err.message })
    }
  }

  // [GET] /account/has-password
  async hasPassword(req, res, next) {
    try {
      const account = await Account.findById(req.account._id).select('password')
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })
      res.json({ hasPassword: !!account.password })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra mật khẩu', error: err.message })
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

  // [PUT] /account/update-password
  async updatePassword(req, res) {
    try {
      const account = await Account.findById(req.account._id)
      if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })

      const { currentPassword, newPassword } = req.body
      if (!newPassword) return res.status(400).json({ message: 'Vui lòng nhập mật khẩu mới' })

      const hasPassword = Boolean(account.password)

      if (hasPassword) {
        if (!currentPassword) return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại' })
        const isMatch = await bcrypt.compare(currentPassword, account.password)
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng.' })
      }

      account.password = newPassword
      await account.save()

      res.json({
        message: hasPassword ? 'Đổi mật khẩu thành công.' : 'Thiết lập mật khẩu thành công.'
      })
    } catch (err) {
      res.status(500).json({
        message: 'Lỗi máy chủ khi thay đổi mật khẩu',
        error: err.message
      })
    }
  }

  // [PUT] /account/update-phone
  async updatePhone(req, res) {
    try {
      const accountId = req.account.id
      if (!accountId) return res.status(401).json({ message: 'Chưa đăng nhập' })

      const { phone } = req.body
      if (!phone) return res.status(400).json({ message: 'Vui lòng nhập số điện thoại mới' })

      const phoneExists = await Account.findOne({
        phoneNumber: phone,
        _id: { $ne: accountId }
      })

      if (phoneExists) return res.status(409).json({ message: 'Số điện thoại đã được sử dụng bởi tài khoản khác' })
      const updated = await Account.findByIdAndUpdate(accountId, { phoneNumber: phone }, { new: true })
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tài khoản' })
      res.json({ message: 'Cập nhật số điện thoại thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật số điện thoại', error: err.message })
    }
  }

  // [PUT] /account/avatar
  async changeAvatar(req, res) {
    try {
      const accountId = req.account._id
      if (!accountId) return res.status(401).json({ message: 'Chưa đăng nhập' })
      if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn ảnh đại diện mới' })

      const updated = await Account.findByIdAndUpdate(
        accountId,
        {
          avatar: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        },
        { new: true }
      )

      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tài khoản' })
      res.json({ message: 'Cập nhật ảnh đại diện thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật ảnh đại diện', error: err.message })
    }
  }

  // [PUT] /account/profile
  async hasProfile(req, res, next) {
    try {
      const accountId = req.account._id
      if (!accountId) return res.status(401).json({ message: 'Chưa đăng nhập' })

      const updated = await Account.findByIdAndUpdate(accountId, { profile: true })

      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tài khoản' })
      res.json({ message: 'Cập nhật tài khoản thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật tài khoản', error: err.message })
    }
  }
}

module.exports = new AdminController()
