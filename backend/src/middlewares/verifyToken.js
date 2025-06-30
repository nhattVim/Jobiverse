const jwt = require('jsonwebtoken')
const Account = require('../models/Account')
const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = ([...role]) => {
  return async (req, res, next) => {
    // const token = req.headers.authorization?.split(' ')[1]
    const token = req.cookies.token

    if (!token) return res.status(498).json({ message: 'Invalid Token' })

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const account = await Account.findById(decoded.id)
      if (!account) return res.status(498).json({ message: 'Token không đúng' })

      console.log()
      console.log('========================')
      console.log('Token role:', account.role)
      console.log('Required role:', role)
      console.log('========================')
      console.log()

      if (role.length > 0 && !role.includes(account.role)) {
        return res.status(403).json({ message: 'Account không có quyền truy cập' })
      }

      req.account = account
      next()
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(498).json({ message: 'Token đã hết hạn' })
      } else {
        return res.status(498).json({ message: 'Token không hợp lệ' })
      }
    }
  }
}

module.exports = verifyToken
