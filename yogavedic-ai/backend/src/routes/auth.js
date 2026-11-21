import { Router } from 'express'
import User from '../models/User.js'
import { signToken, authMiddleware } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, profile = {} } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please provide a valid email address.' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(409).json({ error: 'An account with this email already exists.' })
    const user = await User.create({ name, email, passwordHash: password, profile })
    const token = signToken({ userId: user._id, role: user.role })
    return res.status(201).json({ token, user: user.toSafeJSON() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password are required.' })
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' })
    const valid = await user.comparePassword(password)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' })
    const token = signToken({ userId: user._id, role: user.role })
    return res.json({ token, user: user.toSafeJSON() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    return res.json({ user: user.toSafeJSON() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
