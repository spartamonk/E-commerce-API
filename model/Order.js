const mongoose = require('mongoose')

const CartItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
})

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, 'Tax is required'],
    },
    shippingFee: {
      type: Number,
      required: [true, 'Shipping fee is required'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
    },
    cartItems: [CartItemSchema],
    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'delivered', 'cancelled', 'failed'],
        message: '{VALUE} is required',
      },
      default: 'pending',
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'User',
    },
    clientSecret: {
      type: String,
      required: [true, 'Client secret is required'],
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)
module.exports = mongoose.model('Order', OrderSchema)
