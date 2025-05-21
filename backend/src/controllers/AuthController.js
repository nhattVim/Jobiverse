const Account = require('../models/Account')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const fs = require('fs')
const axios = require('axios')
const path = require('path')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const JWT_SECRET = process.env.JWT_SECRET
const DefaultAvatar = fs.readFileSync(path.join(__dirname, '../../public', 'default-avatar.png'))

class AccountController {
  // [POST] /register
  async register(req, res) {
    try {
      const { method } = req.body
      console.log('Register method:', method)

      if (method === 'email') {

        const { accountType, email, password, phoneNumber } = req.body
        const avatar = req.file ? req.file.buffer : null
        const trimmedEmail = email?.trim()
        const trimmedPhone = phoneNumber?.trim()

        if (!trimmedEmail || !trimmedPhone || !password || !accountType) {
          return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
        }

        const emailExists = await Account.findOne({ email: trimmedEmail, deleted: false })
        if (emailExists) return res.status(400).json({ message: 'Email đã được sử dụng' })

        const phoneExists = await Account.findOne({ phoneNumber: trimmedPhone, deleted: false })
        if (phoneExists) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' })

        const account = await Account.create({
          accountType,
          email: trimmedEmail,
          password,
          phoneNumber: trimmedPhone,
          avatar: req.file
            ? { data: req.file.buffer, contentType: req.file.mimetype }
            : { data: DefaultAvatar, contentType: 'image/png' }
        })

        res.status(201).json({ message: 'Tạo tài khoản thành công', accountID: account._id })

      } else if (method === 'google') {

        const { ggToken, accountType } = req.body
        if (!ggToken || !accountType) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })

        const ticket = await client.verifyIdToken({ idToken: ggToken, audience: process.env.GOOGLE_CLIENT_ID })
        const payload = ticket.getPayload()
        const { email, picture } = payload

        let account = await Account.findOne({ email, deleted: false })
        if (!account) {
          const response = await axios.get(picture, { responseType: 'arraybuffer' })
          const buffer = Buffer.from(response.data, 'binary')
          const contentType = response.headers['content-type']

          account = await Account.create({
            accountType,
            email,
            password: null,
            phoneNumber: null,
            avatar: { data: buffer, contentType }
          })
        }

        const token = jwt.sign({ id: account._id, type: account.accountType }, JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({ message: 'Tăng nhập bằng Google thành công', token })

      } else if (method === 'facebook') {

        const { fbToken, accountType } = req.body
        if (!fbToken || !accountType) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })

        const fbResponse = await axios.get('https://graph.facebook.com/me', {
          params: {
            access_token: fbToken,
            fields: 'id,email,picture'
          }
        })

        const { email, picture } = fbResponse.data
        if (!email) return res.status(400).json({ message: 'Không lấy được email từ Facebook' })

        let account = await Account.findOne({ email, deleted: false })

        if (!account) {
          const picUrl = picture?.data?.url
          let avatarData = DefaultAvatar
          let contentType = 'image/png'

          if (picUrl) {
            const response = await axios.get(picUrl, { responseType: 'arraybuffer' })
            avatarData = Buffer.from(response.data, 'binary')
            contentType = response.headers['content-type']
          }

          account = await Account.create({
            accountType,
            email,
            password: null,
            phoneNumber: null,
            avatar: { data: avatarData, contentType }
          })
        }

        const token = jwt.sign({ id: account._id, type: account.accountType }, JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({ message: 'Đăng kí bằng Facebook thành công', token })
      } else {
        res.status(400).json({ message: 'Phương thức đăng ký không hợp lệ' })
      }
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản', error: err.message })
    }
  }

  // [POST] /login
  async login(req, res) {
    try {
      const { method } = req.body

      if (method === 'email') {

        const { emailOrPhone, password } = req.body
        if (!emailOrPhone || !password) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })

        const isEmail = emailOrPhone.includes('@')
        let account = isEmail
          ? await Account.findOne({ email: emailOrPhone, deleted: false })
          : await Account.findOne({ phoneNumber: emailOrPhone, deleted: false })

        if (!account) return res.status(404).json({ message: 'Email hoặc số điện thoại không tồn tại' })

        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' })

        const token = jwt.sign({ id: account._id, type: account.accountType }, JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({ message: 'Đăng nhập thành công', token })

      } else if (method === 'google') {

        const { ggToken } = req.body
        if (!ggToken) return res.status(400).json({ message: 'Thiếu token Google' })

        const ticket = await client.verifyIdToken({ idToken: ggToken, audience: process.env.GOOGLE_CLIENT_ID })
        const payload = ticket.getPayload()
        const { email } = payload

        const account = await Account.findOne({ email, deleted: false })
        console.log(account)
        if (!account) return res.status(404).json({ message: 'Tài khoản Google chưa đăng ký' })

        const token = jwt.sign({ id: account._id, type: account.accountType }, JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({ message: 'Đăng nhập Google thành công', token })

      } else if (method === 'facebook') {

        const { fbToken } = req.body
        if (!fbToken) return res.status(400).json({ message: 'Thiếu token Facebook' })

        const fbResponse = await axios.get('https://graph.facebook.com/me', {
          params: {
            access_token: fbToken,
            fields: 'id,email'
          }
        })

        const { email } = fbResponse.data
        if (!email) return res.status(400).json({ message: 'Không lấy được email từ Facebook' })

        const account = await Account.findOne({ email, deleted: false })
        if (!account) return res.status(404).json({ message: 'Tài khoản Facebook chưa đăng ký' })

        const token = jwt.sign({ id: account._id, type: account.accountType }, JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({ message: 'Đăng nhập Facebook thành công', token })

      } else {
        res.status(400).json({ message: 'Phương thức đăng nhập không hợp lệ' })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Lỗi khi đăng nhập', error: err.message })
    }
  }

  // [POST] /logout
  async logout(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
      })
      res.json({ message: 'Đăng xuất thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi đăng xuất', error: err.message })
    }
  }
}

module.exports = new AccountController()
