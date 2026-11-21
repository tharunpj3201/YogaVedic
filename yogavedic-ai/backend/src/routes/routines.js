import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// These are generated client-side; this endpoint is for saving favourites to MongoDB in v2.
router.get('/favourites', async (req, res) => {
  // Phase 2: retrieve saved routines from DB
  res.json({ routines: [], message: 'Saved routines endpoint — Phase 2 feature.' })
})

router.post('/favourites', async (req, res) => {
  res.json({ message: 'Routine saved (Phase 2).', routine: req.body })
})

export default router
