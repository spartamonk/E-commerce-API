const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizedPersonnels,
  authorizedUserAccess,
} = require('../middlewares')

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userControllers')

router
  .route('/')
  .get(
    [authenticateUser, authorizedUserAccess(authorizedPersonnels)],
    getAllUsers
  )

router.route('/showMe').get(authenticateUser, showCurrentUser)

router.route('/updateUser').patch(authenticateUser, updateUser)

router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router
