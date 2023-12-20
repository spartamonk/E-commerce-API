const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more thna 100 characters'],
    },
    price: {
      type: String,
      required: [true, 'Price is required'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      enum: {
        values: ['kitchen', 'office', 'bedroom'],
        message: '{VALUE} is not supported',
      },
      required: [true, 'Category is required'],
    },
    company: {
      type: String,
      enum: {
        values: ['marcos', 'ikea', 'liddy'],
        message: '{VALUE} is not supported',
      },
      required: [true, 'Please provide company'],
    },
    colors: {
      type: [String],
      required: [true, 'Please provide color'],
      default: ['#222'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, 'Inventory is required'],
      default: 15,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

ProductSchema.virtual('review', {
  foreignField: 'product',
  localField: '_id',
  justOne: false,
  ref: 'Review',
})
ProductSchema.pre('deleteOne', { document: true }, async function () {
  await this.model('Review').deleteMany({ product: this._id })
})
module.exports = mongoose.model('Product', ProductSchema)
