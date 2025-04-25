const accountRouter = require('./account')
const studentsRouter = require('./students')
const employerRouter = require('./employers')
const CVRouter = require('./cv')
const verifyToken = require('../middlewares/auth');

function route(app) {
  app.use('/account', accountRouter)
  app.use('/students', verifyToken("student"), studentsRouter)
  app.use('/cv', verifyToken("student"), CVRouter)
  app.use('/employers', verifyToken("employer"), employerRouter)
}

module.exports = route