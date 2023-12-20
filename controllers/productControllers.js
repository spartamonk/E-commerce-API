const Product = require('../model/Product')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate({
    path: 'review',
    select: 'title rating',
  })
  res
    .status(StatusCodes.OK)
    .json({ success: true, products, count: products.length })
}

const getSingleProduct = async (req, res) => {
  const {
    params: { id: productId },
  } = req
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product exists with id : ${productId}`)
  }
  res.status(StatusCodes.OK).json({ success: true, product })
}

const createProduct = async (req, res) => {
  const {
    body,
    user: { userId },
  } = req
  req.body.user = userId
  const product = await Product.create(body)
  res.status(StatusCodes.CREATED).json({ success: true, product })
}

const updateProduct = async (req, res) => {
  const {
    body,
    params: { id: productId },
  } = req
  const product = await Product.findOneAndUpdate({ _id: productId }, body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new NotFoundError(`No product exists with id : ${productId}`)
  }
  res.status(StatusCodes.OK).json({ success: true, product })
}

const deleteProduct = async (req, res) => {
  const {
    params: { id: productId },
  } = req
  const product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product exists with id : ${productId}`)
  }
  await product.deleteOne()

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: 'Product has been successfully deleted' })
}

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('Please attach file')
  }
  const productImage = req.files.image
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('File must be an image')
  }
  const maxSize = 1024 * 1024
  if (productImage.size > maxSize) {
    throw new BadRequestError('Image cannot be more than 1MB')
  }
  const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
    use_filename: true,
    folder: 'products',
  })
  fs.unlinkSync(productImage.tempFilePath)
  res
    .status(StatusCodes.OK)
    .json({ success: true, image: { src: result.secure_url } })
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  createProduct,
  uploadImage,
}
