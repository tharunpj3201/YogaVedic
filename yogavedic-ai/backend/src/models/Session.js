import mongoose from 'mongoose'

const PoseResultSchema = new mongoose.Schema({
  poseId: String,
  poseName: String,
  accuracy: Number,
  durationSec: Number
}, { _id: false })

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  routineTitle: { type: String, required: true },
  routineId: String,
  durationMin: { type: Number, required: true },
  accuracy: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  posesCompleted: { type: Number, default: 0 },
  poseResults: [PoseResultSchema],
  targetCategories: [String],
  fitnessLevel: String,
  feedback: String,
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true })

SessionSchema.index({ userId: 1, completedAt: -1 })
SessionSchema.index({ completedAt: -1 })

export default mongoose.model('Session', SessionSchema)
