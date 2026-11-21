// YogaVedic — Test Suite
// Run: npx vitest (after adding vitest to devDependencies)

import { describe, it, expect } from 'vitest'
import { angleBetween, verticalAngle, levelDiff, evaluateChecks, computeAccuracy } from '../src/services/poseAnalysis.js'
import { generateRoutine } from '../src/services/routineGenerator.js'
import { computeStats } from '../src/services/storageService.js'

// ─── poseAnalysis Unit Tests ─────────────────────────────────────────────────

describe('angleBetween()', () => {
  it('returns 90° for a right angle', () => {
    const A = { x: 0, y: 1 }
    const B = { x: 0, y: 0 }
    const C = { x: 1, y: 0 }
    expect(angleBetween(A, B, C)).toBe(90)
  })

  it('returns 180° for a straight line', () => {
    const A = { x: -1, y: 0 }
    const B = { x: 0, y: 0 }
    const C = { x: 1, y: 0 }
    expect(angleBetween(A, B, C)).toBe(180)
  })

  it('returns null if any point is null', () => {
    expect(angleBetween(null, { x: 0, y: 0 }, { x: 1, y: 0 })).toBeNull()
  })
})

describe('verticalAngle()', () => {
  it('returns 0° for a perfectly vertical line', () => {
    expect(verticalAngle({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.8 })).toBe(0)
  })

  it('returns 90° for a horizontal line', () => {
    expect(verticalAngle({ x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 })).toBe(90)
  })
})

describe('levelDiff()', () => {
  it('returns 0 for identical heights', () => {
    expect(levelDiff({ y: 0.4 }, { y: 0.4 })).toBe(0)
  })
  it('returns absolute difference', () => {
    expect(levelDiff({ y: 0.3 }, { y: 0.5 })).toBeCloseTo(0.2)
  })
})

describe('evaluateChecks()', () => {
  const mockLandmarks = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }))

  it('returns empty array for empty checks', () => {
    const result = evaluateChecks([], mockLandmarks)
    expect(result).toEqual([])
  })

  it('returns missing status when visibility is low', () => {
    const lowVisLandmarks = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.3 }))
    const checks = [{
      id: 'test_check',
      type: 'angle',
      points: ['left_shoulder', 'left_elbow', 'left_wrist'],
      targetDeg: 90,
      toleranceDeg: 10,
      feedback: { ok: 'Good', off: 'Adjust' }
    }]
    const result = evaluateChecks(checks, lowVisLandmarks)
    expect(result[0].status).toBe('missing')
  })
})

describe('computeAccuracy()', () => {
  it('returns 100 for all-ok results', () => {
    const results = [
      { status: 'ok' }, { status: 'ok' }
    ]
    expect(computeAccuracy(results)).toBe(100)
  })

  it('returns 50 for half-ok results', () => {
    const results = [{ status: 'ok' }, { status: 'off' }]
    expect(computeAccuracy(results)).toBe(50)
  })

  it('ignores missing results in denominator', () => {
    const results = [{ status: 'ok' }, { status: 'missing' }]
    expect(computeAccuracy(results)).toBe(100)
  })

  it('returns 0 for empty array', () => {
    expect(computeAccuracy([])).toBe(0)
  })
})

// ─── routineGenerator Unit Tests ─────────────────────────────────────────────

describe('generateRoutine()', () => {
  it('returns a valid routine structure', () => {
    const routine = generateRoutine({
      durationMin: 15,
      conditions: [],
      fitnessLevel: 'beginner',
      age: 22,
      goal: 'stress'
    })
    expect(routine).toHaveProperty('sequence')
    expect(routine.sequence.length).toBeGreaterThan(0)
    expect(routine.durationMin).toBe(15)
  })

  it('starts with a warmup pose', () => {
    const routine = generateRoutine({ durationMin: 15, conditions: [], fitnessLevel: 'beginner', age: 22, goal: '' })
    expect(routine.sequence[0].phase).toBe('warmup')
  })

  it('ends with a cooldown pose', () => {
    const routine = generateRoutine({ durationMin: 15, conditions: [], fitnessLevel: 'beginner', age: 22, goal: '' })
    const last = routine.sequence[routine.sequence.length - 1]
    expect(last.phase).toBe('cooldown')
  })

  it('assigns positive duration to each pose', () => {
    const routine = generateRoutine({ durationMin: 10, conditions: [], fitnessLevel: 'beginner', age: 22, goal: '' })
    routine.sequence.forEach(pose => {
      expect(pose.assignedDurationSec).toBeGreaterThan(0)
    })
  })

  it('generates a title containing the duration', () => {
    const routine = generateRoutine({ durationMin: 20, conditions: [], fitnessLevel: 'intermediate', age: 25, goal: 'back_pain' })
    expect(routine.title).toContain('20')
  })
})

// ─── storageService Unit Tests ────────────────────────────────────────────────

describe('computeStats()', () => {
  const mockSessions = [
    { date: new Date().toISOString(), durationMin: 15, accuracy: 80, calories: 60 },
    { date: new Date().toISOString(), durationMin: 20, accuracy: 70, calories: 80 },
  ]

  it('calculates totals correctly', () => {
    const stats = computeStats(mockSessions)
    expect(stats.totalSessions).toBe(2)
    expect(stats.totalMinutes).toBe(35)
    expect(stats.totalCalories).toBe(140)
  })

  it('calculates average accuracy', () => {
    const stats = computeStats(mockSessions)
    expect(stats.avgAccuracy).toBe(75)
  })

  it('returns zero stats for empty sessions', () => {
    const stats = computeStats([])
    expect(stats.totalSessions).toBe(0)
    expect(stats.avgAccuracy).toBe(0)
  })

  it('returns weeklyData array of 7', () => {
    const stats = computeStats(mockSessions)
    expect(stats.weeklyData.length).toBe(7)
  })
})
