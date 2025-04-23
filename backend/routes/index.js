const authRouter = require('./auth')
const studentsRouter = require('./students')
const employerRouter = require('./employers')
const verifyToken = require('../middlewares/auth');

function route(app) {
  app.use('/auth', authRouter)
  app.use('/students', verifyToken, studentsRouter)
  app.use('/employers', verifyToken, employerRouter)
}

module.exports = route