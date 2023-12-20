const Review = require('../model/Review')
const Product = require('../model/Product')
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { checkUserAccess } = require('../utils')
const createReview = async (req, res) => {
  const {
    body: { product: productId },
    user: { userId },
  } = req
  const isProductExist = await Product.findOne({ _id: productId })
  if (!isProductExist) {
    throw new NotFoundError(`No product exists with id : ${productId}`)
  }
  const isUserLeftReview = await Review.findOne({
    product: productId,
    user: userId,
  })
  if (isUserLeftReview) {
    throw new BadRequestError('You have already left a review for this product')
  }
  req.body.user = userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({ success: true, review })
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'user',
      select: 'name role',
    })
    .populate({ path: 'product', select: 'name price' })
  res
    .status(StatusCodes.OK)
    .json({ success: true, reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const {
    params: { id: reviewId },
  } = req
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review exists with id ${reviewId}`)
  }
  res.status(StatusCodes.OK).json({ success: true, review })
}

const updateReview = async (req, res) => {
  const {
    params: { id: reviewId },
    user,
    body: { comment, title, rating },
  } = req
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review exists with id : ${reviewId}`)
  }

  checkUserAccess({ user, resouceId: review.user })
  review.comment = comment
  review.title = title
  review.rating = rating
  await review.save()
  res.status(StatusCodes.OK).json({ success: true, review })
}

const deleteReview = async (req, res) => {
  const {
    params: { id: reviewId },
    user,
  } = req
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review exists with id : ${reviewId}`)
  }
  checkUserAccess({ user, resouceId: review.user })
  await review.deleteOne()
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: 'Review successfully deleted' })
}

const getSingleProductReviews = async (req, res) => {
  const {
    params: { id: productId },
  } = req
  const reviews = await Review.find({ product: productId })
  res
    .status(StatusCodes.OK)
    .json({ success: true, reviews, count: reviews.length })
}
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
