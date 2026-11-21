// Routine Generator — YogaVedic
// Pure personalization logic, no external dependencies.
// Given a user profile, returns a time-aware, condition-matched yoga sequence.

import { POSES, CATEGORIES } from '../data/routines.js'
import { detectCategoryKeys } from './nlpService.js'
import { LOCALES } from '../contexts/LanguageContext.jsx'

function getLocale(langCode) {
  return LOCALES[langCode] || LOCALES['en-IN']
}

const CONDITION_CATEGORY_MAP = {
  back_pain: CATEGORIES.BACK_PAIN,
  stress: CATEGORIES.STRESS_RELIEF,
  anxiety: CATEGORIES.STRESS_RELIEF,
  weight_loss: CATEGORIES.WEIGHT_LOSS,
  diabetes: CATEGORIES.DIABETES_SUPPORT,
  flexibility: CATEGORIES.FLEXIBILITY,
  student: CATEGORIES.STUDENT_WELLNESS,
  corporate: CATEGORIES.CORPORATE_WELLNESS
}

const BEGINNER_POSE_IDS = [
  'tadasana', 'sukhasana', 'balasana', 'marjaryasana_bitilasana',
  'shavasana', 'vrikshasana', 'setu_bandhasana'
]

const WARMUP_IDS = ['tadasana', 'marjaryasana_bitilasana', 'sukhasana']
const COOLDOWN_IDS = ['balasana', 'paschimottanasana', 'shavasana']

function scorePose(pose, categories, isBeginner) {
  let score = 0
  pose.categories.forEach(cat => {
    if (categories.includes(cat)) score += 3
  })
  if (isBeginner && BEGINNER_POSE_IDS.includes(pose.id)) score += 2
  if (pose.cameraFriendly) score += 1
  return score
}

function distributeTime(totalSec, poseCount) {
  // Warmup ~15%, Core ~65%, Cooldown ~20%
  const warmup = Math.round(totalSec * 0.15)
  const cooldown = Math.round(totalSec * 0.20)
  const core = totalSec - warmup - cooldown
  const corePerPose = Math.round(core / Math.max(poseCount, 1))
  return { warmup, cooldown, corePerPose }
}

export function generateRoutine({ durationMin = 15, conditions = [], fitnessLevel = 'beginner', age = 25, goal = '', langCode = 'en-IN' }) {
  const totalSec = durationMin * 60
  const isBeginner = fitnessLevel === 'beginner'
  const isAdvanced = fitnessLevel === 'advanced'

  // Map user-stated conditions/goals to pose categories using NLP keyword
  // matching (handles both structured condition tags and free-text goals
  // like "I want to reduce my lower back pain and manage exam stress").
  const targetCats = []
  const searchStr = [conditions.join(' '), goal].join(' ')
  const detectedKeys = detectCategoryKeys(searchStr, langCode)
  detectedKeys.forEach(key => {
    const cat = CONDITION_CATEGORY_MAP[key]
    if (cat && !targetCats.includes(cat)) targetCats.push(cat)
  })
  if (targetCats.length === 0) targetCats.push(CATEGORIES.STUDENT_WELLNESS)

  // Score and rank all poses
  const scored = POSES.map(p => ({ pose: p, score: scorePose(p, targetCats, isBeginner) }))
  scored.sort((a, b) => b.score - a.score)

  // Fix warmup and cooldown sequences
  const warmupPoses = WARMUP_IDS.map(id => POSES.find(p => p.id === id)).filter(Boolean)
  const cooldownPoses = COOLDOWN_IDS.map(id => POSES.find(p => p.id === id)).filter(Boolean)
  const reservedIds = new Set([...WARMUP_IDS, ...COOLDOWN_IDS])

  // Pick core poses from scored list
  const coreCount = durationMin <= 10 ? 3 : durationMin <= 20 ? 5 : 8
  const corePoses = scored
    .filter(s => !reservedIds.has(s.pose.id))
    .slice(0, isAdvanced ? coreCount + 2 : coreCount)
    .map(s => s.pose)

  // Assign durations
  const { warmup, cooldown, corePerPose } = distributeTime(totalSec, corePoses.length)
  const warmupSec = Math.round(warmup / warmupPoses.length)
  const cooldownSec = Math.round(cooldown / cooldownPoses.length)

  const sequence = [
    ...warmupPoses.map(p => ({ ...p, assignedDurationSec: warmupSec, phase: 'warmup' })),
    ...corePoses.map(p => ({ ...p, assignedDurationSec: corePerPose, phase: 'core' })),
    ...cooldownPoses.map(p => ({ ...p, assignedDurationSec: cooldownSec, phase: 'cooldown' }))
  ]

  const totalTime = sequence.reduce((s, p) => s + p.assignedDurationSec, 0)

  return {
    id: `routine_${Date.now()}`,
    title: buildTitle(targetCats, durationMin, langCode),
    durationMin,
    fitnessLevel,
    targetCategories: targetCats,
    totalPoses: sequence.length,
    estimatedCalories: estimateCalories(durationMin, fitnessLevel, age),
    sequence,
    totalTimeSec: totalTime,
    generatedAt: new Date().toISOString()
  }
}

function buildTitle(cats, dur, langCode = 'en-IN') {
  const ui = getLocale(langCode).ui
  const catLabelKey = {
    [CATEGORIES.BACK_PAIN]: 'goalBackCare',
    [CATEGORIES.STRESS_RELIEF]: 'goalStressRelief',
    [CATEGORIES.WEIGHT_LOSS]: 'goalWeightLoss',
    [CATEGORIES.DIABETES_SUPPORT]: 'goalMetabolicBalance',
    [CATEGORIES.FLEXIBILITY]: 'goalFlexibility',
    [CATEGORIES.STUDENT_WELLNESS]: 'goalStudentFocus',
    [CATEGORIES.CORPORATE_WELLNESS]: 'goalDeskRecovery'
  }
  const label = ui[catLabelKey[cats[0]]] || ui.holisticFlow
  const minUnit = ui.minUnit || 'min'
  const sequenceWord = ui.sequenceWord || 'Sequence'
  return `${dur}-${minUnit} ${label} ${sequenceWord}`
}

function estimateCalories(durationMin, level, age) {
  const mets = { beginner: 2.5, intermediate: 3.5, advanced: 4.5 }
  const met = mets[level] || 3
  // Approx: MET × 3.5 × weight_kg / 200 × min. Assume 65kg, age-corrected.
  const ageFactor = age > 50 ? 0.9 : 1.0
  return Math.round(met * 3.5 * 65 / 200 * durationMin * ageFactor)
}

// labelKey points at a ui.* string in the locale files so the Quick Start
// cards render in the active language instead of hardcoded English.
export function getQuickRoutines(langCode = 'en-IN') {
  const ui = getLocale(langCode).ui
  return [
    { label: ui.quickMorningEnergiser, labelKey: 'quickMorningEnergiser', durationMin: 10, conditions: [], goal: 'student', fitnessLevel: 'beginner' },
    { label: ui.quickDeskRecovery15, labelKey: 'quickDeskRecovery15', durationMin: 15, conditions: [], goal: 'corporate', fitnessLevel: 'beginner' },
    { label: ui.quickBackCare20, labelKey: 'quickBackCare20', durationMin: 20, conditions: ['back_pain'], goal: '', fitnessLevel: 'intermediate' },
    { label: ui.quickActiveFlow30, labelKey: 'quickActiveFlow30', durationMin: 30, conditions: [], goal: 'weight_loss', fitnessLevel: 'intermediate' }
  ]
}
