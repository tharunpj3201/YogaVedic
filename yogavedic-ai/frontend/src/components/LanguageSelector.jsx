// LanguageSelector — YogaVedic
// Dropdown matching the "🌐 English ▾" control in the screenshots. Switching
// is instant (no page reload) since LanguageContext re-renders everything
// subscribed to useLanguage(), and updates the voice coach's active speech
// language for the very next spoken cue.

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { setVoiceLanguage } from '../services/voiceCoach.js'

export default function LanguageSelector() {
  const { langCode, setLanguage, options, locale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(code) {
    setLanguage(code)
    setVoiceLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-night-soft text-sandstone/70 text-sm font-body hover:border-turmeric/30 transition-colors"
      >
        <GlobeIcon className="w-4 h-4" />
        {locale.name}
        <ChevronIcon className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl glass-card hover-lift shadow-xl overflow-hidden z-30">
          {options.map(opt => (
            <button
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-body text-left transition-colors
                ${opt.code === langCode ? 'bg-turmeric/10 text-turmeric' : 'text-sandstone/70 hover:bg-night-soft/50'}`}
            >
              <span>{opt.name}</span>
              <span className="text-xs opacity-60">{opt.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GlobeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  )
}
function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
