// LanguageContext — YogaVedic
// Provides app-wide access to the active language, instant switching
// (no reload), and translation helpers for both UI strings and the
// voice coach's spoken phrase templates.

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import enIN from '../locales/en-IN.json'
import hiIN from '../locales/hi-IN.json'
import knIN from '../locales/kn-IN.json'
import taIN from '../locales/ta-IN.json'
import teIN from '../locales/te-IN.json'

export const LOCALES = {
  'en-IN': enIN,
  'hi-IN': hiIN,
  'kn-IN': knIN,
  'ta-IN': taIN,
  'te-IN': teIN
}

export const LANGUAGE_OPTIONS = Object.values(LOCALES).map(l => ({
  code: l.code,
  name: l.name,
  nativeName: l.nativeName
}))

const STORAGE_KEY = 'yv_language'

function loadStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && LOCALES[stored] ? stored : 'en-IN'
  } catch {
    return 'en-IN'
  }
}

const LanguageContext = createContext(null)

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState(loadStoredLanguage)

  const locale = LOCALES[langCode] || LOCALES['en-IN']

  const setLanguage = useCallback((code) => {
    if (!LOCALES[code]) return
    setLangCode(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch { /* ignore */ }
  }, [])

  // UI string lookup: t('startSession') -> "Start Session" / "सत्र शुरू करें" / ...
  const t = useCallback((key) => {
    return locale.ui[key] ?? LOCALES['en-IN'].ui[key] ?? key
  }, [locale])

  // Voice phrase lookup with {placeholder} interpolation:
  // phrase('poseIntro', { poseName: 'Cobra Pose' })
  const phrase = useCallback((key, vars = {}) => {
    const template = locale.phrases[key] ?? LOCALES['en-IN'].phrases[key] ?? ''
    return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`))
  }, [locale])

  const value = useMemo(() => ({
    langCode,
    locale,
    speechLang: locale.speechLang,
    setLanguage,
    t,
    phrase,
    options: LANGUAGE_OPTIONS
  }), [langCode, locale, setLanguage, t, phrase])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
