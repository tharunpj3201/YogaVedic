import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatRespond, getChatStrings } from '../services/nlpService.js'
import { api } from '../services/apiClient.js'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function ChatAssistant() {
  const { langCode } = useLanguage()
  const strings = getChatStrings(langCode)

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'bot', text: strings.greeting }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const prevLangRef = useRef(langCode)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, typing, open])

  // When the person switches language mid-conversation, re-greet in the new
  // language so the assistant doesn't keep speaking the old one — everything
  // else (past messages) stays as-is since those were genuinely said in the
  // previous language.
  useEffect(() => {
    if (prevLangRef.current === langCode) return
    prevLangRef.current = langCode
    const freshStrings = getChatStrings(langCode)
    setMessages(m => [...m, { role: 'bot', text: freshStrings.greeting }])
  }, [langCode])

  function send(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return

    // Snapshot the conversation so far (before this message) to send as
    // context to the AI — keeps replies coherent across turns instead of
    // treating every message as a fresh, context-free question.
    const historyForApi = messages.map(m => ({ role: m.role, text: m.text }))

    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)

    api.chatMessage({ message: text, history: historyForApi, langCode })
      .then(({ reply }) => {
        setMessages(m => [...m, { role: 'bot', text: reply }])
      })
      .catch(() => {
        // Server has no ANTHROPIC_API_KEY configured, the network is down,
        // or the AI call failed for any other reason — fall back to the
        // offline, rule-based assistant so the widget still answers common
        // questions (poses, health conditions, app FAQs) instead of breaking.
        const reply = chatRespond(text, langCode)
        setMessages(m => [...m, { role: 'bot', text: reply }])
      })
      .finally(() => setTyping(false))
  }

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }}
        aria-label={open ? 'Close assistant' : 'Open YogaVedic assistant'}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 w-14 h-14 rounded-full bg-gold-gradient text-night-deep shadow-glow-turmeric-lg flex items-center justify-center active:scale-95 transition-all hover:scale-105">
        {open
          ? <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          : <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v12H8l-4 4V4z" /></svg>
        }
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-40 md:bottom-24 right-4 md:right-8 z-40 w-[calc(100vw-2rem)] max-w-sm h-[28rem] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            <div className="px-4 py-3.5 border-b border-night-soft/60 flex items-center gap-2.5 bg-night-soft/20">
              <div className="w-8 h-8 rounded-full bg-gold-gradient shadow-glow-turmeric flex items-center justify-center text-night-deep font-display text-sm shrink-0 font-semibold">ॐ</div>
              <div>
                <p className="font-body font-semibold text-sandstone text-sm">{strings.headerTitle}</p>
                <p className="text-sandstone/40 text-xs font-body">{strings.headerSubtitle}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-body leading-snug
                    ${m.role === 'user'
                      ? 'bg-gold-gradient text-night-deep rounded-br-sm shadow-glow-turmeric'
                      : 'bg-night-soft text-sandstone rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-night-soft text-sandstone/50 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm font-body flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sandstone/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-sandstone/40 animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-sandstone/40 animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={send} className="p-3 border-t border-night-soft/60 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                placeholder={strings.inputPlaceholder} maxLength={200}
                className="flex-1 bg-night-deep/60 border border-night-soft rounded-xl px-3.5 py-2.5 text-sandstone font-body text-sm placeholder:text-sandstone/30 focus:outline-none focus:border-turmeric/60 focus:ring-2 focus:ring-turmeric/20 transition-colors" />
              <button type="submit" disabled={!input.trim()}
                aria-label="Send message"
                className="w-10 h-10 shrink-0 rounded-xl bg-gold-gradient text-night-deep flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:brightness-110">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
