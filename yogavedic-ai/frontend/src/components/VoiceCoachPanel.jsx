// VoiceCoachPanel — YogaVedic
// The "AI COACH (VOICE)" card from the screenshots: shows the last/current
// spoken line plus an animated waveform while speech is active. Purely
// presentational — actual speech happens in services/voiceCoach.js.

import React, { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { hasNativeVoiceSupport } from '../services/languageService.js'

export default function VoiceCoachPanel({ message, voiceOn, onToggle }) {
  const { t, locale, speechLang } = useLanguage()
  const [speaking, setSpeaking] = useState(false)
  const [nativeVoice, setNativeVoice] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const interval = setInterval(() => {
      setSpeaking(window.speechSynthesis.speaking)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // Voice lists load asynchronously in most browsers, and change whenever the
  // person switches language — recheck whenever either happens so the
  // "using default voice" notice is accurate instead of stale.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    function check() { setNativeVoice(hasNativeVoiceSupport(speechLang)) }
    check()
    window.speechSynthesis.addEventListener('voiceschanged', check)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check)
  }, [speechLang])

  return (
    <div className="rounded-2xl glass-card hover-lift p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-body text-sandstone/40 uppercase tracking-widest flex items-center gap-1.5">
          <MicIcon className="w-3.5 h-3.5" />
          {t('aiCoachVoice')}
        </p>
        <span className="text-[10px] font-body text-sandstone/30">{locale.nativeName}</span>
      </div>

      <p className="text-sandstone/70 text-sm font-body min-h-[2.5rem] leading-snug">
        {message || (voiceOn ? '…' : t('voiceCoachOff'))}
      </p>

      {voiceOn && !nativeVoice && (
        <p className="text-terracotta/70 text-[11px] font-body mt-1.5 leading-snug">
          ⚠ {t('nativeVoiceUnavailable')}
        </p>
      )}

      <div className="flex items-center gap-0.5 h-6 mt-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 rounded-full transition-all duration-150 ${voiceOn && speaking ? 'bg-sage' : 'bg-night-soft'}`}
            style={{
              height: voiceOn && speaking ? `${20 + Math.abs(Math.sin(i * 0.9 + Date.now() / 200)) * 80}%` : '15%'
            }}
          />
        ))}
      </div>

      <button
        onClick={onToggle}
        className={`w-full mt-3 py-2 rounded-xl border text-xs font-body transition-all
          ${voiceOn ? 'border-turmeric/30 text-turmeric' : 'border-night-soft text-sandstone/40'}`}
      >
        {voiceOn ? `🔊 ${t('voiceCoachOn')}` : `🔇 ${t('voiceCoachOff')}`}
      </button>
    </div>
  )
}

function MicIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M9 22h6" />
    </svg>
  )
}
