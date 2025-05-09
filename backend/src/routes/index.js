const authRouter = require('./auth')
const studentsRouter = require('./students')
const employerRouter = require('./employers')
const accountRouter = require('./accounts')
const CVRouter = require('./cv')
const projectRouter = require('./projects')
const notificationRouter = require('./notifications')

function route(app) {
  app.use('/', authRouter)
  app.use('/account', accountRouter)
  app.use('/students', studentsRouter)
  app.use('/cv', CVRouter)
  app.use('/employers', employerRouter)
  app.use('/projects', projectRouter)
  app.use('/notify', notificationRouter)
}

module.exports = route