// NLP Service — YogaVedic
// Lightweight, dependency-free natural-language understanding that runs
// entirely in the browser (no external API calls, nothing leaves the device).
//
// Used in three places across the app:
//   1. Onboarding — turns a free-text goal ("I want to fix my back pain and
//      sleep better") into structured health condition tags.
//   2. Routine Generator — replaces a naive substring match (which only ever
//      matched literal keys like "back_pain" and therefore never matched real
//      sentences) with proper synonym-based keyword matching.
//   3. Chat Assistant + Voice Commands — simple rule-based intent matching
//      for the in-app assistant and hands-free session control.
//
// LANGUAGE AWARENESS: every function below takes an optional langCode
// ('en-IN' | 'hi-IN' | 'kn-IN' | 'ta-IN' | 'te-IN'). Keyword banks, FAQ
// responses, and voice command phrases are all looked up per-language from
// data/nlpTranslations.js, so switching the app's language also switches
// what the assistant understands and how it replies/speaks — not just the
// static UI strings. Callers that don't pass a langCode keep working exactly
// as before (falls back to 'en-IN').

import { POSES } from '../data/routines.js'
import {
  CONDITION_KEYWORDS_BY_LANG,
  CATEGORY_KEYWORDS_BY_LANG,
  CHAT_STRINGS_BY_LANG,
  FAQ_BY_LANG,
  VOICE_COMMAND_PATTERNS_BY_LANG,
  CONDITION_LABELS_BY_LANG,
  withFallback
} from '../data/nlpTranslations.js'

// Kept exported for any external code that still imports the flat en-IN bank.
export const CONDITION_KEYWORDS = CONDITION_KEYWORDS_BY_LANG['en-IN']
export const CATEGORY_KEYWORDS = CATEGORY_KEYWORDS_BY_LANG['en-IN']
export const VOICE_COMMAND_PATTERNS = VOICE_COMMAND_PATTERNS_BY_LANG['en-IN']

function textIncludesAny(lowerText, keywords) {
  return keywords.some(kw => lowerText.includes(kw))
}

function normalize(text) {
  return (text || '').toLowerCase().replace(/_/g, ' ')
}

/** Extract onboarding-style condition labels (e.g. "Back Pain") from free text. */
export function extractConditionsFromText(text, langCode = 'en-IN') {
  if (!text || !text.trim()) return []
  const lower = normalize(text)
  const bank = withFallback(CONDITION_KEYWORDS_BY_LANG, langCode)
  const enBank = CONDITION_KEYWORDS_BY_LANG['en-IN']
  const matched = new Set()
  for (const [label, keywords] of Object.entries(bank)) {
    if (textIncludesAny(lower, keywords)) matched.add(label)
  }
  if (langCode !== 'en-IN') {
    for (const [label, keywords] of Object.entries(enBank)) {
      if (textIncludesAny(lower, keywords)) matched.add(label)
    }
  }
  return Array.from(matched)
}

/** Extract routineGenerator category keys (e.g. "back_pain") from free text. */
export function detectCategoryKeys(text, langCode = 'en-IN') {
  if (!text || !text.trim()) return []
  const lower = normalize(text)
  const bank = withFallback(CATEGORY_KEYWORDS_BY_LANG, langCode)
  const enBank = CATEGORY_KEYWORDS_BY_LANG['en-IN']
  const matched = new Set()
  for (const [key, keywords] of Object.entries(bank)) {
    if (textIncludesAny(lower, keywords)) matched.add(key)
  }
  if (langCode !== 'en-IN') {
    for (const [key, keywords] of Object.entries(enBank)) {
      if (textIncludesAny(lower, keywords)) matched.add(key)
    }
  }
  return Array.from(matched)
}

function findPoseMention(lowerText) {
  return POSES.find(p =>
    lowerText.includes(p.name.toLowerCase()) || lowerText.includes(p.sanskrit.toLowerCase())
  )
}

/** Rule-based chat response for the in-app assistant, localized to langCode. */
export function chatRespond(message, langCode = 'en-IN') {
  const strings = withFallback(CHAT_STRINGS_BY_LANG, langCode)
  const lower = (message || '').toLowerCase().trim()
  if (!lower) return strings.emptyInputPrompt

  const pose = findPoseMention(lower)
  if (pose) {
    return strings.poseTemplate
      .replace('{poseName}', pose.name)
      .replace('{sanskrit}', pose.sanskrit)
      .replace('{benefits}', pose.benefits)
      .replace('{firstInstruction}', pose.instructions[0])
  }

  const conditions = extractConditionsFromText(lower, langCode)
  if (conditions.length > 0) {
    const labelBank = withFallback(CONDITION_LABELS_BY_LANG, langCode)
    const localizedConditions = conditions.map(c => labelBank[c] || c)
    return strings.conditionsTemplate.replace('{conditions}', localizedConditions.join(', '))
  }

  const faqBank = withFallback(FAQ_BY_LANG, langCode)
  const faq = faqBank.find(f => textIncludesAny(lower, f.keywords))
  if (faq) return faq.response

  if (langCode !== 'en-IN') {
    const enFaq = FAQ_BY_LANG['en-IN'].find(f => textIncludesAny(lower, f.keywords))
    if (enFaq) return enFaq.response
  }

  return strings.notSure
}

/** Localized static strings for the chat assistant UI (greeting, placeholder, etc). */
export function getChatStrings(langCode = 'en-IN') {
  return withFallback(CHAT_STRINGS_BY_LANG, langCode)
}

/** Parses a spoken transcript into a session command, or null if no match. */
export function parseVoiceCommand(transcript, langCode = 'en-IN') {
  const lower = (transcript || '').toLowerCase().trim()
  if (!lower) return null
  const patterns = withFallback(VOICE_COMMAND_PATTERNS_BY_LANG, langCode)
  for (const [action, phrases] of Object.entries(patterns)) {
    if (phrases.some(p => lower.includes(p))) return action
  }
  if (langCode !== 'en-IN') {
    const enPatterns = VOICE_COMMAND_PATTERNS_BY_LANG['en-IN']
    for (const [action, phrases] of Object.entries(enPatterns)) {
      if (phrases.some(p => lower.includes(p))) return action
    }
  }
  return null
}
