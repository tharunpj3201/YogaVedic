import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../App.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

const HOW_IT_WORKS_STEPS = [
  { emoji: '📝', title: 'Tell us about you', body: "A quick onboarding — age, fitness level, and any goals like back pain or stress relief. Our NLP even reads a free-text goal like \"I want to reduce stress\" and matches it automatically." },
  { emoji: '🧘', title: 'Get a routine', body: 'YogaVedic builds a warm-up → core → cooldown sequence sized to your available time and matched to your goals.' },
  { emoji: '📷', title: 'Practice with live feedback', body: 'Point your webcam at yourself. MediaPipe tracks 33 body landmarks in real time and the voice coach corrects your alignment as you go — all processed locally.' }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { profile } = useApp()
  const { isAuthenticated } = useAuth()
  const [breathPhase, setBreathPhase] = useState('inhale')
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(p => p === 'inhale' ? 'exhale' : 'inhale')
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  function handleStart() {
    if (!isAuthenticated) navigate('/register')
    else if (profile.onboardingComplete) navigate('/dashboard')
    else navigate('/onboarding')
  }

  return (
    <div className="min-h-screen bg-night-deep bg-mesh-hero flex flex-col items-center justify-center overflow-hidden relative px-4">

      {/* Background mandala grid — subtle depth */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #E8A33D 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Floating glow orbs — ambient depth */}
      <motion.div className="absolute top-[12%] left-[10%] w-64 h-64 rounded-full bg-turmeric/10 blur-3xl pointer-events-none animate-float" />
      <motion.div className="absolute bottom-[15%] right-[8%] w-72 h-72 rounded-full bg-sage/10 blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
      <motion.div className="absolute top-[45%] right-[20%] w-40 h-40 rounded-full bg-terracotta/10 blur-3xl pointer-events-none animate-float" style={{ animationDelay: '4s' }} />

      {/* Prana rings — the signature breathing element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[320, 240, 160].map((size, i) => (
          <motion.div key={size} className="absolute rounded-full border border-turmeric/20 prana-ring"
            style={{ width: size, height: size }}
            animate={{ scale: breathPhase === 'inhale' ? [1, 1.08] : [1.08, 1], opacity: breathPhase === 'inhale' ? [0.15, 0.35] : [0.35, 0.15] }}
            transition={{ duration: 4, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}
        <motion.div className="w-20 h-20 rounded-full bg-gold-gradient shadow-glow-turmeric-lg border border-turmeric/40 flex items-center justify-center"
          animate={{ scale: breathPhase === 'inhale' ? 1.12 : 0.92 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        >
          <span className="text-night-deep font-display text-2xl font-semibold">ॐ</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-turmeric font-mono text-xs tracking-[0.25em] uppercase mb-6">
          Real-Time Yoga Coaching
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="font-display text-5xl sm:text-7xl font-semibold text-sandstone leading-[1.08] mb-4">
          YogaVedic
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="font-body text-sandstone/60 text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
          Ancient yoga wisdom meets real-time pose detection and feedback. A personalised coach in your pocket — no gym, no instructor needed.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleStart}
            className="px-8 py-3.5 btn-glow text-night-deep font-body font-bold rounded-xl active:scale-95 transition-all text-base">
            Start Your Journey
          </button>
          <button onClick={() => setShowHowItWorks(true)}
            className="px-8 py-3.5 border border-night-soft/80 bg-night-soft/10 backdrop-blur-sm text-sandstone/70 font-body font-medium rounded-xl hover:border-turmeric/40 hover:text-sandstone transition-all text-base">
            See How It Works
          </button>
        </motion.div>

        {/* Breath instruction — tied to the ring animation */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-10 text-sandstone/30 text-sm font-body tracking-wide">
          {breathPhase === 'inhale' ? '↑ Breathe in…' : '↓ Breathe out…'}
        </motion.p>

        {!isAuthenticated && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="mt-4 text-sandstone/40 text-sm font-body">
            Already have an account? <button onClick={() => navigate('/login')} className="text-turmeric hover:text-turmeric-light transition-colors">Sign in</button>
          </motion.p>
        )}
      </div>

      {/* Feature pills at the bottom */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 flex flex-wrap gap-2 justify-center px-4 max-w-xl">
        {['Real-time Pose Detection', 'Voice Coach', 'Personalised Routines', 'Progress Dashboard', 'Back Pain · Stress · Diabetes'].map(f => (
          <span key={f} className="px-3 py-1 rounded-full border border-night-soft/80 bg-night-soft/10 backdrop-blur-sm text-sandstone/50 text-xs font-body hover:border-turmeric/30 hover:text-sandstone/70 transition-all">{f}</span>
        ))}
      </motion.div>

      {/* How It Works modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-night-deep/80 backdrop-blur-sm px-4"
            onClick={() => setShowHowItWorks(false)}
            role="dialog" aria-modal="true" aria-label="How YogaVedic works">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md glass-card rounded-2xl p-6 relative">
              <button onClick={() => setShowHowItWorks(false)} aria-label="Close"
                className="absolute top-4 right-4 text-sandstone/40 hover:text-sandstone transition-colors">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              <h3 className="font-display text-2xl text-sandstone mb-6">How it works</h3>
              <div className="space-y-5">
                {HOW_IT_WORKS_STEPS.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-2xl shrink-0">{s.emoji}</span>
                    <div>
                      <p className="font-body font-semibold text-sandstone text-sm mb-1">{s.title}</p>
                      <p className="text-sandstone/50 font-body text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => { setShowHowItWorks(false); handleStart() }}
                className="w-full mt-7 py-3 btn-glow text-night-deep font-body font-bold rounded-xl text-sm hover:bg-turmeric-light active:scale-98 transition-all">
                Get Started →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
