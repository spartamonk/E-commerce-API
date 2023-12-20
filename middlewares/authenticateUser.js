const { isTokenValid } = require('../utils')
const { UnauthenticatedError } = require('../errors')
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  try {
    const { name, role, userId } = isTokenValid(token)
    req.user = {
      name,
      role,
      userId,
    }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Invalid credentials')
  }
}

module.exports = authenticateUser
