const usersRouter = require('./users')
const studentsRouter = require('./students')
const employerRouter = require('./employers')

function route(app) {
  app.use('/users', usersRouter)
  app.use('/students', studentsRouter)
  app.use('/employers', employerRouter)
}

module.exports = route