import { Router } from 'express'
import mongoose from 'mongoose'
import Session from '../models/Session.js'
import User from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// POST /api/sessions — log a completed session
router.post('/', async (req, res) => {
  try {
    const { routineTitle, durationMin, accuracy, calories, posesCompleted, poseResults, targetCategories, fitnessLevel } = req.body
    const session = await Session.create({
      userId: req.user.userId,
      routineTitle, durationMin, accuracy, calories,
      posesCompleted, poseResults, targetCategories, fitnessLevel
    })
    // Update user aggregate stats
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: {
        'stats.totalSessions': 1,
        'stats.totalMinutes': durationMin,
        'stats.totalCalories': calories || 0
      },
      $set: { 'stats.lastSessionDate': new Date() }
    })
    return res.status(201).json({ session })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// GET /api/sessions — paginated session history
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    const sessions = await Session.find({ userId: req.user.userId })
      .sort({ completedAt: -1 }).skip(skip).limit(limit)
    const total = await Session.countDocuments({ userId: req.user.userId })
    return res.json({ sessions, page, limit, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// GET /api/sessions/stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.userId
    const [aggResult] = await Session.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalMinutes: { $sum: '$durationMin' },
        totalCalories: { $sum: '$calories' },
        avgAccuracy: { $avg: '$accuracy' }
      }}
    ])
    return res.json({ stats: aggResult || {} })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// DELETE /api/sessions — clear all session history for this account
router.delete('/', async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.user.userId })
    await User.findByIdAndUpdate(req.user.userId, {
      $set: {
        'stats.totalSessions': 0,
        'stats.totalMinutes': 0,
        'stats.totalCalories': 0,
        'stats.avgAccuracy': 0,
        'stats.streak': 0
      }
    })
    return res.json({ message: 'Session history cleared.' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
