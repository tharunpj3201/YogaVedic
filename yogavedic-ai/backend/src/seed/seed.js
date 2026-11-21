// Development seed script - populates a LOCAL database with demo users and sample sessions.
//
// SAFETY: this script is destructive. It replaces ALL users and sessions in the target database.
//   - It refuses to run when NODE_ENV=production.
//   - It refuses to touch a non-local MongoDB host unless you also pass --allow-remote.
//   - If the database already contains users or sessions, it refuses to delete them unless you
//     pass --confirm-delete. An empty database needs no confirmation.
//   - No passwords are stored in this file. Set SEED_PASSWORD (min 12 chars) or let the script
//     generate a random one for this run and print it once to your terminal.
//
// Usage (from backend/):   npm run seed
//                          npm run seed -- --confirm-delete
import 'dotenv/config'
import crypto from 'node:crypto'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Session from '../models/Session.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yogavedic'
const CONFIRM_DELETE = process.argv.includes('--confirm-delete')
const ALLOW_REMOTE = process.argv.includes('--allow-remote')
// Hosts treated as local: this machine, or the `mongo` service name used by docker-compose.yml.
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'mongo'])

function refuse(message) {
  console.error(`\nSeed refused: ${message}\n`)
  process.exit(1)
}

// Never prints the URI (it may contain credentials).
function usesOnlyLocalHosts(uri) {
  const m = /^mongodb(\+srv)?:\/\/(?:[^@/]*@)?([^/?]+)/i.exec(uri)
  if (!m || m[1]) return false // unparseable, or mongodb+srv:// (hosted cluster)
  return m[2].split(',').every(hp => {
    const host = hp.startsWith('[') ? hp.slice(0, hp.indexOf(']') + 1) : hp.split(':')[0]
    return LOCAL_HOSTS.has(host.toLowerCase())
  })
}

function resolveSeedPassword() {
  const fromEnv = process.env.SEED_PASSWORD
  if (fromEnv !== undefined && fromEnv !== '') {
    if (fromEnv.length < 12) refuse('SEED_PASSWORD must be at least 12 characters.')
    return { value: fromEnv, generated: false }
  }
  return { value: crypto.randomBytes(12).toString('base64url'), generated: true }
}

function assertSafeToRun() {
  if ((process.env.NODE_ENV || '').trim().toLowerCase() === 'production') {
    refuse('NODE_ENV is "production". The seed script only runs in development.')
  }
  if (!usesOnlyLocalHosts(MONGO_URI) && !ALLOW_REMOTE) {
    refuse('MONGO_URI does not point at a local MongoDB (localhost, 127.0.0.1 or the docker-compose "mongo" service). ' +
      'If you really intend to seed a remote development database, add --allow-remote.')
  }
}

assertSafeToRun()
const SEED_PASSWORD = resolveSeedPassword()

const DEMO_USERS = [
  {
    name: 'Shivakumar Rao', email: 'shiva@example.com',
    passwordHash: SEED_PASSWORD.value, // plain text here; the User model hashes it on save
    profile: { age: 22, gender: 'male', weight: 68, height: 172, fitnessLevel: 'beginner', conditions: ['Stress / Anxiety', 'Back Pain'], goal: 'Reduce exam stress and improve posture' },
    role: 'user'
  },
  {
    name: 'Priya Sharma', email: 'priya@example.com',
    passwordHash: SEED_PASSWORD.value, // plain text here; the User model hashes it on save
    profile: { age: 24, gender: 'female', weight: 55, height: 163, fitnessLevel: 'intermediate', conditions: ['Flexibility'], goal: 'Improve flexibility and core strength' },
    role: 'user'
  },
  {
    name: 'Admin YogaVedic', email: 'admin@yogavedic.ai',
    passwordHash: SEED_PASSWORD.value, // plain text here; the User model hashes it on save
    profile: { age: 30, gender: 'other', weight: 70, height: 175, fitnessLevel: 'advanced', conditions: [], goal: 'Platform health monitoring' },
    role: 'admin'
  }
]

const ROUTINE_TITLES = [
  '15-min Student Focus Sequence', '20-min Back Care Sequence',
  '10-min Desk Recovery Sequence', '30-min Active Flow Sequence',
  '15-min Stress Relief Sequence'
]

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  const [existingUsers, existingSessions] = await Promise.all([User.countDocuments(), Session.countDocuments()])
  if (existingUsers + existingSessions > 0) {
    if (!CONFIRM_DELETE) {
      await mongoose.disconnect()
      refuse(`the database already contains ${existingUsers} user(s) and ${existingSessions} session(s). ` +
        'Seeding replaces ALL of them. Nothing was deleted. To proceed, re-run with: npm run seed -- --confirm-delete')
    }
    await User.deleteMany({})
    await Session.deleteMany({})
    console.log(`Deleted ${existingUsers} user(s) and ${existingSessions} session(s) (--confirm-delete)`)
  } else {
    console.log('Database is empty; nothing to delete')
  }

  const createdUsers = []
  for (const u of DEMO_USERS) {
    const user = await User.create(u)
    createdUsers.push(user)
    console.log(`Created user: ${user.name}`)
  }

  // Seed 14 days of sessions for first two users
  for (const user of createdUsers.slice(0, 2)) {
    for (let d = 13; d >= 0; d--) {
      if (Math.random() > 0.3) {
        const completedAt = new Date()
        completedAt.setDate(completedAt.getDate() - d)
        await Session.create({
          userId: user._id,
          routineTitle: ROUTINE_TITLES[Math.floor(Math.random() * ROUTINE_TITLES.length)],
          durationMin: [10, 15, 20, 30][Math.floor(Math.random() * 4)],
          accuracy: 60 + Math.floor(Math.random() * 35),
          calories: 40 + Math.floor(Math.random() * 80),
          posesCompleted: 4 + Math.floor(Math.random() * 8),
          fitnessLevel: user.profile.fitnessLevel,
          completedAt
        })
      }
    }
    console.log(`Seeded sessions for ${user.name}`)
  }

  console.log('Seed complete')
  console.log('Demo accounts (local development only): ' + DEMO_USERS.map(u => u.email).join(', '))
  if (SEED_PASSWORD.generated) {
    console.log(`Password for all demo accounts (random, shown once): ${SEED_PASSWORD.value}`)
  } else {
    console.log('Password for all demo accounts: the value of SEED_PASSWORD')
  }
  await mongoose.disconnect()
}

seed().catch(e => { console.error(e); process.exit(1) })
