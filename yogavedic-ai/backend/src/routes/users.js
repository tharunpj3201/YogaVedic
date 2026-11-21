import { Router } from 'express'
import User from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// PATCH /api/users/profile
router.patch('/profile', async (req, res) => {
  try {
    const { name, profile } = req.body
    const updates = {}
    if (name) updates.name = name
    if (profile) updates.profile = { ...profile }
    const user = await User.findByIdAndUpdate(req.user.userId, { $set: updates }, { new: true })
    return res.json({ user: user.toSafeJSON() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// GET /api/users/leaderboard (anonymous — top 10 by sessions)
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, 'stats.totalSessions': 1, 'stats.totalMinutes': 1, 'stats.avgAccuracy': 1 })
      .sort({ 'stats.totalSessions': -1 }).limit(10)
    return res.json({ leaderboard: users })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
