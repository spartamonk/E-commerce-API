const jwt = require('jsonwebtoken')

const createJWT = (payload) => {
  const { name, role, userId } = payload
  return jwt.sign({ name, role, userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ user, res }) => {
  const token = createJWT(user)
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  })
}

module.exports = {
  isTokenValid,
  attachCookiesToResponse,
}
