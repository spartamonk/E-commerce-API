const User = require('../model/User')
const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require('../errors')
const {
  checkUserAccess,
  createTokenUser,
  attachCookiesToResponse,
} = require('../utils')
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ success: true, users, count: users.length })
}

const showCurrentUser = async (req, res) => {
  const { user } = req
  res.status(StatusCodes.OK).json({ success: true, user })
}

const getSingleUser = async (req, res) => {
  const {
    params: { id: userId },
    user,
  } = req
  const userResource = await User.findOne({ _id: userId }).select('-password')
  if (!userResource) {
    throw new NotFoundError(`No user exists with id : ${userId}`)
  }
  checkUserAccess({ user, resourceId: userResource._id })
  res.status(StatusCodes.OK).json({ success: true, user })
}

const updateUser = async (req, res) => {
  const {
    user: { userId },
    body: { name, email },
  } = req
  if (!name || !email) {
    throw new BadRequestError('Please provide name and email')
  }
  const user = await User.findOne({ _id: userId })
  user.name = name
  user.email = email
  await user.save()
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ user: tokenUser, res })
  res.status(StatusCodes.OK).json({ success: true, user })
}

const updateUserPassword = async (req, res) => {
  const {
    user: { userId },
    body: { currentPassword, newPassword },
  } = req
  if (!currentPassword || !newPassword) {
    throw new BadRequestError('Please provide current and new password')
  }
  const user = await User.findOne({ _id: userId })
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword)
  if (!isCurrentPasswordCorrect) {
    throw new UnauthenticatedError('Current password is invalid')
  }
  user.password = newPassword
  await user.save()
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ user: tokenUser, res })
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: `Password has been updated successfully!` })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
}
