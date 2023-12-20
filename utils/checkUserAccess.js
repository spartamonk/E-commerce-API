const { UnauthorizedError } = require('../errors')
const checkUserAccess = ({ user, resouceId }) => {
  const { userId, role } = user
  if (role === 'admin') return
  if (userId === resouceId.toString()) return
  throw new UnauthorizedError('You are not allowed to access this route')
}

module.exports = checkUserAccess
