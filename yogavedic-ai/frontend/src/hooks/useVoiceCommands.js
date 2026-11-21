// useVoiceCommands — YogaVedic
// Hands-free session control via the browser's SpeechRecognition API.
// Listens continuously while enabled and turns recognized phrases into
// structured commands (next / pause / resume / repeat / exit) using the
// shared NLP parser, so the mapping logic lives in one place.

import { useEffect, useRef, useState } from 'react'
import { parseVoiceCommand } from '../services/nlpService.js'

export function useVoiceCommands({ enabled, onCommand, lang = 'en-IN', langCode }) {
  // `lang` drives the browser's SpeechRecognition (what language it
  // transcribes speech AS), while `langCode` drives which localized command
  // phrase bank the transcript is matched AGAINST. They're normally the
  // same value (e.g. both "hi-IN") — langCode defaults to lang so existing
  // callers that only pass `lang` keep matching correctly.
  const commandLangCode = langCode || lang
  const recognitionRef = useRef(null)
  const enabledRef = useRef(enabled)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [lastHeard, setLastHeard] = useState('')

  useEffect(() => { enabledRef.current = enabled }, [enabled])

  useEffect(() => {
    const SpeechRecognitionImpl = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null

    if (!SpeechRecognitionImpl) {
      setSupported(false)
      return
    }

    if (!enabled) {
      setListening(false)
      return
    }

    const recognition = new SpeechRecognitionImpl()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = lang

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      const transcript = last[0].transcript.trim()
      setLastHeard(transcript)
      const command = parseVoiceCommand(transcript, commandLangCode)
      if (command) onCommand?.(command)
    }

    recognition.onerror = (e) => {
      // "no-speech" and "aborted" are routine (silence, tab switch) — don't
      // treat them as fatal. Anything else, stop trying so we don't spam.
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        setListening(false)
      }
    }

    recognition.onend = () => {
      // Browsers stop recognition after a pause/silence — auto-restart while
      // the person still has voice commands turned on.
      if (enabledRef.current) {
        try { recognition.start() } catch { /* already starting */ }
      } else {
        setListening(false)
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setListening(true)
    } catch { /* already started */ }

    return () => {
      recognition.onend = null
      recognition.onresult = null
      recognition.onerror = null
      try { recognition.stop() } catch { /* noop */ }
      recognitionRef.current = null
      setListening(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, lang, commandLangCode])

  return { listening, supported, lastHeard }
}
