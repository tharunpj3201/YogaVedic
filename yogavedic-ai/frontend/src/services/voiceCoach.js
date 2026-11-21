// Voice Coach — YogaVedic
// Wraps the Web Speech API with intelligent throttling so the AI coach
// isn't repeating itself every frame, and adds:
//   1. Multi-language voice selection (matches getBestVoiceForLanguage)
//   2. A continuous "still with you" loop — even when nothing has changed,
//      the coach checks in roughly every CONTINUOUS_INTERVAL_MS so a learner
//      doing a long hold (Shavasana, seated breathing) never feels like the
//      app went silent and stopped watching them.

import { getBestVoiceForLanguage } from './languageService.js'

const MIN_INTERVAL_MS = 5000       // floor between any two spoken cues
const CONTINUOUS_INTERVAL_MS = 8000 // cadence for the "still here" loop during a hold

let lastSpokenMessage = ''
let lastSpokenAt = 0
let mutedUntil = 0
let activeSpeechLang = 'en-IN'
let continuousTimer = null

function speak(text, { priority = 'normal' } = {}) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return
  const now = Date.now()
  if (now < mutedUntil) return

  const isDuplicate = text === lastSpokenMessage
  const tooSoon = now - lastSpokenAt < MIN_INTERVAL_MS

  if (isDuplicate && tooSoon) return
  if (tooSoon && priority !== 'high') return

  lastSpokenMessage = text
  lastSpokenAt = now

  window.speechSynthesis.cancel() // drop any current speech immediately for corrections
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.92
  utterance.pitch = 1.0
  utterance.volume = 1.0
  utterance.lang = activeSpeechLang

  const voice = getBestVoiceForLanguage(activeSpeechLang)
  if (voice) utterance.voice = voice

  window.speechSynthesis.speak(utterance)
}

// Call once whenever the active UI language changes so subsequent speak()
// calls use the right voice + lang tag immediately, no reload needed.
export function setVoiceLanguage(speechLang) {
  activeSpeechLang = speechLang || 'en-IN'
}

export function speakFeedback(feedbackObj) {
  if (!feedbackObj) return
  const { type, message } = feedbackObj
  if (type === 'correction') {
    speak(message, { priority: 'high' })
  } else if (type === 'praise') {
    speak(message, { priority: 'normal' })
  }
}

export function speakPoseIntro(poseName, phaseName, phraseFn) {
  const key = phaseName === 'warmup' ? 'poseIntroWarmup'
    : phaseName === 'cooldown' ? 'poseIntroCooldown'
    : 'poseIntro'
  const msg = phraseFn ? phraseFn(key, { poseName }) : `Next pose: ${poseName}.`
  speak(msg, { priority: 'high' })
}

export function speakCountdown(seconds) {
  if (seconds <= 3 && seconds > 0) speak(`${seconds}`, { priority: 'high' })
}

export function speakSessionComplete(stats, phraseFn) {
  const msg = phraseFn
    ? phraseFn('sessionComplete', { accuracy: stats.accuracy, calories: stats.calories })
    : `Well done! You completed your session. Accuracy score: ${stats.accuracy} percent. You burned approximately ${stats.calories} calories. Namaste.`
  speak(msg, { priority: 'high' })
}

// ── Continuous coaching loop ─────────────────────────────────────────────
// While a pose is being held, fires every CONTINUOUS_INTERVAL_MS with a
// gentle "still going" line — UNLESS a higher-priority correction/praise
// has spoken more recently than that interval, so it never talks over
// itself or feels repetitive when real-time feedback is already active.
export function startContinuousCoaching({ phraseFn, getMessage }) {
  stopContinuousCoaching()
  continuousTimer = setInterval(() => {
    const now = Date.now()
    // Skip this tick if something else spoke recently — avoids stacking cues
    if (now - lastSpokenAt < CONTINUOUS_INTERVAL_MS * 0.6) return
    const custom = getMessage ? getMessage() : null
    const msg = custom || (phraseFn ? phraseFn('breatheReminder') : 'Keep breathing steadily.')
    speak(msg, { priority: 'normal' })
  }, CONTINUOUS_INTERVAL_MS)
}

export function stopContinuousCoaching() {
  if (continuousTimer) {
    clearInterval(continuousTimer)
    continuousTimer = null
  }
}

export function muteCoach() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
  mutedUntil = Date.now() + 60 * 60 * 1000 // effectively muted until unmuteCoach() is called
}

export function unmuteCoach() {
  mutedUntil = 0
}

export function isVoiceSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}
