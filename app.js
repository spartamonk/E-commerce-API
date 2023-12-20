require('dotenv').config()
require('express-async-errors')
// security
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongooseSanitize = require('express-mongo-sanitize')
const cors = require('cors')

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const fileUploader = require('express-fileupload')
const connectDB = require('./db/connect')
const { errorHandlerMiddleware, notFoundMiddleware } = require('./middlewares')
const cloudinary = require('cloudinary').v2
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})
// middlewares
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
)
app.use(helmet())
app.use(xss())
app.use(cors())
app.use(mongooseSanitize())
app.use(fileUploader({ useTempFiles: true }))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static('./public'))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
// start
const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()
