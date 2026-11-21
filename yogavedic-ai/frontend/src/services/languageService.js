// Language Service — YogaVedic
// Bridges the (English-only) biomechanical check results from poseAnalysis.js
// with the active UI language, so real-time feedback, the readiness list,
// and the voice coach all speak/display in the learner's chosen language —
// without touching the geometry/threshold logic in poseAnalysis.js.

import { getLocalizedCheckFeedback } from '../data/checkFeedbackTranslations.js'

// Re-maps each checkResult's `message` to the localized string for langCode.
// Geometry fields (status, deg, checkId) pass through unchanged.
export function localizeCheckResults(checkResults, langCode) {
  if (!checkResults || checkResults.length === 0) return checkResults
  return checkResults.map(r => {
    if (r.status === 'missing') {
      return { ...r, message: localizedMissingMessage(langCode) }
    }
    const localized = getLocalizedCheckFeedback(r.checkId, langCode, null)
    if (!localized) return r
    return { ...r, message: localized[r.status] || r.message }
  })
}

function localizedMissingMessage(langCode) {
  const map = {
    'en-IN': 'Move into frame to get feedback.',
    'hi-IN': 'प्रतिक्रिया पाने के लिए कैमरे के सामने आएं।',
    'kn-IN': 'ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಲು ಚೌಕಟ್ಟಿನೊಳಗೆ ಬರಿ.',
    'ta-IN': 'கருத்து பெற கேமரா முன் வரவும்.',
    'te-IN': 'ఫీడ్‌బ్యాక్ పొందడానికి ఫ్రేమ్‌లోకి రండి.'
  }
  return map[langCode] || map['en-IN']
}

// Mirrors poseAnalysis.pickPrimaryFeedback but operates on already-localized
// checkResults, so the chosen message is in the right language.
export function pickPrimaryFeedbackLocalized(localizedResults) {
  if (!localizedResults || localizedResults.length === 0) return null
  const firstOff = localizedResults.find(r => r.status === 'off')
  if (firstOff) return { type: 'correction', message: firstOff.message, checkId: firstOff.checkId }
  const firstOk = localizedResults.find(r => r.status === 'ok')
  if (firstOk) return { type: 'praise', message: firstOk.message, checkId: firstOk.checkId }
  return { type: 'neutral', message: null }
}

// Friendly display name fallback for a pose if locale-specific names aren't
// provided separately (Sanskrit names already read fine across languages).
export function getPoseDisplayName(pose) {
  return pose?.sanskritName || pose?.name || ''
}

// ── Voice selection ─────────────────────────────────────────────────────────
// speechSynthesis.getVoices() is async/lazy on first load in most browsers,
// so we cache + re-poll once voiceschanged fires.
let cachedVoices = []

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  cachedVoices = window.speechSynthesis.getVoices() || []
  return cachedVoices
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices()
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

// Finds the best matching installed voice for a BCP-47 code like "hi-IN".
// Falls back: exact lang match -> base language match (e.g. "hi") -> null
// (null means the browser's default voice will be used, which still speaks
// the text but may use a different accent).
export function getBestVoiceForLanguage(speechLang) {
  const voices = cachedVoices.length ? cachedVoices : refreshVoices()
  if (!voices.length) return null
  const exact = voices.find(v => v.lang === speechLang)
  if (exact) return exact
  const base = speechLang.split('-')[0]
  const baseMatch = voices.find(v => v.lang && v.lang.split('-')[0] === base)
  return baseMatch || null
}

export function hasNativeVoiceSupport(speechLang) {
  return !!getBestVoiceForLanguage(speechLang)
}
