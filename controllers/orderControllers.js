const Order = require('../model/Order')
const Product = require('../model/Product')
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { checkUserAccess } = require('../utils')
const fakeStripeAPI = async (total, currency) => {
  return {
    client_secret: 'someRandomValue',
    total,
  }
}

const createOrder = async (req, res) => {
  const {
    body: { tax, shippingFee, items },
    user: { userId },
  } = req
  if (!items || items.length < 1) {
    throw new BadRequestError('No items have been added to the cart')
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError('Please provide tax and shipping fee')
  }
  let subtotal = 0
  let cartItems = []
  for (let item of items) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new NotFoundError(`No item exists with id : ${item.product}`)
    }
    const { _id: productId, name, image, price } = dbProduct
    const singleItem = {
      product: productId,
      name,
      image,
      price,
      amount: item.amount,
    }
    cartItems = [...cartItems, singleItem]
    subtotal += item.amount * price
  }
  const total = tax + shippingFee + subtotal
  const { client_secret, total: verifiedTotal } = await fakeStripeAPI(
    total,
    'USD'
  )
  const order = await Order.create({
    clientSecret: client_secret,
    cartItems,
    shippingFee,
    tax,
    subtotal,
    user: userId,
    total: verifiedTotal,
  })
  res.status(StatusCodes.CREATED).json({ success: true, order })
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res
    .status(StatusCodes.OK)
    .json({ success: true, orders, count: orders.length })
}

const getSingleOrder = async (req, res) => {
  const {
    params: { id: orderId },
    user,
  } = req
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new NotFoundError(`No order exists with id : ${orderId}`)
  }
  checkUserAccess({ user, resouceId: order.user })
  res.status(StatusCodes.OK).json({ success: true, order })
}

const getCurrentUserOrders = async (req, res) => {
  const {
    user: { userId },
  } = req
  const orders = await Order.find({ user: userId })
  res
    .status(StatusCodes.OK)
    .json({ success: true, orders, count: orders.length })
}

const updateOrder = async (req, res) => {
  const {
    params: { id: orderId },
    user,
    body: { paymentIntentId },
  } = req
  const order = await Order.findOne({ _id: orderId })
  if (!paymentIntentId) {
    throw new BadRequestError('Please provide payment intent id')
  }
  if (!order) {
    throw new NotFoundError(`No order exists with id : ${orderId}`)
  }
  checkUserAccess({ user, resouceId: order.user })
  order.paymentId = paymentIntentId
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({ success: true, order })
}

module.exports = {
  updateOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  createOrder,
}
