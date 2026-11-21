import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import sessionRoutes from './routes/sessions.js'
import routineRoutes from './routes/routines.js'
import chatRoutes from './routes/chat.js'
import { validateJwtSecret } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'YogaVedic API', version: '1.0.0' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/routines', routineRoutes)
app.use('/api/chat', chatRoutes)

// 404 for unmatched routes
app.use((req, res) => res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

async function bootstrap() {
  try {
    validateJwtSecret() // fail fast on a missing/weak JWT_SECRET (never logs the value)
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yogavedic')
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 YogaVedic API running on port ${PORT}`))
  } catch (err) {
    console.error('❌ Startup error:', err.message)
    process.exit(1)
  }
}

bootstrap()
export default app
