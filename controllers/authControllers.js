const User = require('../model/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')
const register = async (req, res) => {
  const { body:{name, email, password} } = req

  let role = (await User.countDocuments({})) === 0 ? 'admin' : 'user'
  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ user: tokenUser, res })
  res.status(StatusCodes.CREATED).json({ success: true, user: tokenUser })
}

const login = async (req, res) => {
  const {
    body: { email, password },
  } = req
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ user: tokenUser, res })
  res.status(StatusCodes.OK).json({ success: true, user: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: 'You have logged out successfully!' })
}

module.exports = { register, login, logout }
