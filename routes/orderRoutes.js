const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizedPersonnels,
  authorizedUserAccess,
} = require('../middlewares')
const {
  updateOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  createOrder,
} = require('../controllers/orderControllers')

router
  .route('/')
  .get(
    [authenticateUser, authorizedUserAccess(authorizedPersonnels)],
    getAllOrders
  )
  .post(authenticateUser, createOrder)

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = router
