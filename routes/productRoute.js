const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizedPersonnels,
  authorizedUserAccess,
} = require('../middlewares')

const {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  uploadImage,
} = require('../controllers/productControllers')
const { getSingleProductReviews } = require('../controllers/reviewControllers')
router
  .route('/')
  .get(getAllProducts)
  .post(
    [authenticateUser, authorizedUserAccess(authorizedPersonnels)],
    createProduct
  )

router
  .route('/uploadImage')
  .post(
    [authenticateUser, authorizedUserAccess(authorizedPersonnels)],
    uploadImage
  )

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(
    [authenticateUser, authorizedUserAccess(authorizedPersonnels)],
    updateProduct
  )
  .delete(
    [authenticateUser, authorizedUserAccess(authorizedPersonnels)],
    deleteProduct
  )
router.route('/:id/reviews').get(getSingleProductReviews)
module.exports = router
