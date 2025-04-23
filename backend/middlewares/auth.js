const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Không có token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const account = await Account.findById(decoded.accountID);
    if (!account) return res.status(404).json({ message: 'Token không đúng' });
    req.account = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn' });
    } else {
      res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn' });
    }
  }
};

module.exports = verifyToken;
