import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  profile: {
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other', ''] },
    weight: Number,
    height: Number,
    fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    conditions: [String],
    goal: String,
    onboardingComplete: { type: Boolean, default: false }
  },
  stats: {
    totalSessions: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    totalCalories: { type: Number, default: 0 },
    avgAccuracy: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastSessionDate: Date
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

UserSchema.methods.toSafeJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  return obj
}

UserSchema.index({ 'stats.totalSessions': -1 })

export default mongoose.model('User', UserSchema)
