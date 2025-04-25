const authRouter = require('./auth')
const studentsRouter = require('./students')
const employerRouter = require('./employers')
const accountRouter = require('./accounts')
const CVRouter = require('./cv')
const verifyToken = require('../middlewares/auth');

function route(app) {
  app.use('/', authRouter)
  app.use('/account', verifyToken("admin"), accountRouter)
  app.use('/students', verifyToken("student"), studentsRouter)
  app.use('/cv', verifyToken("student"), CVRouter)
  app.use('/employers', verifyToken("employer"), employerRouter)
}

module.exports = route