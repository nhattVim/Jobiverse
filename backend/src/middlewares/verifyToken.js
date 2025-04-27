const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (role) => {
  return async (req, res, next) => {
    // const token = req.headers.authorization?.split(' ')[1]; // lấy từ header
    const token = req.cookies.token; // lấy từ cookie

    if (!token) return res.status(401).json({ message: 'Không có token' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const account = await Account.findById(decoded.id);
      if (!account) return res.status(404).json({ message: 'Token không đúng' });

      console.log()
      console.log('========================');
      console.log('Token role:', account.accountType);
      console.log('Required role:', role);
      console.log('========================');
      console.log()

      // if (account.accountType !== "admin") {
      if (role && account.accountType !== role) {
        return res.status(403).json({ message: 'Account không có quyền truy cập' });
      }
      // }

      req.account = account;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token đã hết hạn' });
      } else {
        res.status(403).json({ message: 'Token không hợp lệ' });
      }
    }
  };
};

module.exports = verifyToken;
