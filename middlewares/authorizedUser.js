const { UnauthorizedError } = require('../errors')
const authorizedPersonnels = ['admin', 'owner']
const authorizedUserAccess = (roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('You are not authorized to access this route')
    }
    next()
  }
}

module.exports = { authorizedUserAccess, authorizedPersonnels }
