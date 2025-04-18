const usersRouter = require('./users')

function route(app) {
  app.use('/users', usersRouter)
}

module.exports = route