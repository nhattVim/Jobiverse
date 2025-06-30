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
  register = async (req, res) => {
    try {
      const { authProvider } = req.body
      if (authProvider == 'local') {
        return this.registerLocal(req, res)
      } else if (authProvider == 'google') {
        return this.registerGoogle(req, res)
      } else if (authProvider == 'facebook') {
        return this.registerFacebook(req, res)
      } else {
        return res.status(400).json({ message: 'Phương thức đăng ký không hợp lệ' })
      }
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản: ' + err.message })
    }
  }

  // handle register for local account
  registerLocal = async (req, res) => {
    const { role, email, password, phoneNumber } = req.body
    const trimmedEmail = email?.trim()
    const trimmedPhone = phoneNumber?.trim()
    if (!trimmedEmail || !trimmedPhone || !password || !role) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })
    }

    const [emailExists, phoneExists] = await Promise.all([
      Account.findOne({ email: trimmedEmail, deleted: false }),
      Account.findOne({ phoneNumber: trimmedPhone, deleted: false })
    ])
    if (emailExists) return res.status(400).json({ message: 'Email đã được sử dụng' })
    if (phoneExists) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' })

    const avatar = req.file
      ? { data: req.file.buffer, contentType: req.file.mimetype }
      : { data: DefaultAvatar, contentType: 'image/png' }

    const account = await Account.create({
      role,
      email: trimmedEmail,
      password,
      phoneNumber: trimmedPhone,
      authProvider: 'local',
      avatar
    })

    return res.status(201).json({ message: 'Tạo tài khoản thành công', accountID: account._id })
  }

  // handle register for Google account
  registerGoogle = async (req, res) => {
    const { ggToken, role } = req.body
    if (!ggToken || !role) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })

    const ticket = await client.verifyIdToken({ idToken: ggToken, audience: process.env.GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    const { email, picture } = payload

    let account = await Account.findOne({ email, deleted: false })
    if (!account) {
      const avatar = await this.fetchImage(picture)
      account = await Account.create({
        role,
        email,
        password: null,
        phoneNumber: null,
        authProvider: 'google',
        avatar
      })
    }

    this.createAndSetToken(res, account)
    res.json({ message: 'Đăng kí bằng Google thành công' })
  }

  // handle register for Facebook account
  registerFacebook = async (req, res) => {
    const { fbToken, role } = req.body
    if (!fbToken || !role) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })

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
      const avatar = picUrl
        ? await this.fetchImage(picUrl)
        : { data: DefaultAvatar, contentType: 'image/png' }

      account = await Account.create({
        role,
        email,
        password: null,
        phoneNumber: null,
        authProvider: 'facebook',
        avatar
      })
    }

    this.createAndSetToken(res, account)
    res.json({ message: 'Đăng kí bằng Facebook thành công' })
  }

  // [POST] /login
  login = async (req, res) => {
    try {
      const { authProvider } = req.body
      if (authProvider == 'local') {
        return this.loginLocal(req, res)
      } else if (authProvider == 'google') {
        return this.loginGoogle(req, res)
      } else if (authProvider == 'facebook') {
        return this.loginFacebook(req, res)
      } else {
        return res.status(400).json({ message: 'Phương thức đăng nhập không hợp  lệ' })
      }
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi đăng nhập', error: err.message })
    }
  }

  // handle login for local account
  loginLocal = async (req, res) => {
    const { emailOrPhone, password } = req.body
    if (!emailOrPhone || !password) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' })

    const isEmail = emailOrPhone.includes('@')
    const account = await Account.findOne({
      [isEmail ? 'email' : 'phoneNumber']: emailOrPhone,
      deleted: false
    })

    if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' })
    if (!account.password) return res.status(400).json({ message: 'Tài khoản không hỗ trợ mật khẩu' })

    const match = await bcrypt.compare(password, account.password)
    if (!match) return res.status(401).json({ message: 'Sai mật khẩu' })

    this.createAndSetToken(res, account)
    res.json({ message: 'Đăng nhập thành công' })
  }

  // handle login for Google account
  loginGoogle = async (req, res) => {
    const { ggToken } = req.body
    if (!ggToken) return res.status(400).json({ message: 'Thiếu token Google' })

    const ticket = await client.verifyIdToken({ idToken: ggToken, audience: process.env.GOOGLE_CLIENT_ID })
    const { email } = ticket.getPayload()

    const account = await Account.findOne({ email, deleted: false })
    if (!account) return res.status(401).json({ message: 'Tài khoản Google chưa đăng ký' })

    this.createAndSetToken(res, account)
    res.json({ message: 'Đăng nhập Google thành công' })
  }

  // handle login for Facebook account
  loginFacebook = async (req, res) => {
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

    this.createAndSetToken(res, account)
    res.json({ message: 'Đăng nhập Facebook thành công' })
  }

  // [POST] /logout
  logout = async (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
      res.json({ message: 'Đăng xuất thành công' })
    } catch (err) {
      res.status(500).json({ message: 'Lỗi khi đăng xuất', error: err.message })
    }
  }

  // create and set JWT token in cookie
  createAndSetToken = (res, account) => {
    const token = jwt.sign({ id: account._id, type: account.role }, JWT_SECRET, { expiresIn: '30m' })
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
  }

  // fetch image from URL and return as Buffer
  fetchImage = async (url) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      return {
        data: Buffer.from(response.data, 'binary'),
        contentType: response.headers['content-type']
      }
    } catch {
      return { data: DefaultAvatar, contentType: 'image/png' }
    }
  }
}

module.exports = new AccountController()
