import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import promptRoutes from './routes/prompt.route.js'
import cors from 'cors'

// basic setp ups
const app = express()
dotenv.config()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// mongodb connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
  })

  // routes
app.use('/api/users', userRoutes)
app.use('/api/deepseekai', promptRoutes)

app.get('/', (req, res) => {
res.send('Welcome to the DeepSeek Backend!...')
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

