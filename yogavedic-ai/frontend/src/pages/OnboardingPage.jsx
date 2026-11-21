import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../App.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { validateOnboardingStep } from '../utils/validation.js'
import { extractConditionsFromText } from '../services/nlpService.js'

const CONDITIONS = [
  'Back Pain', 'Stress / Anxiety', 'Weight Loss', 'Diabetes', 'Flexibility', 'Poor Posture', 'Insomnia'
]

const STEPS = [
  { id: 'name', title: "What's your name?", subtitle: 'Used to personalise your routines.' },
  { id: 'basics', title: 'Tell us about yourself', subtitle: 'For accurate calorie and routine estimates.' },
  { id: 'fitness', title: 'Your fitness level', subtitle: "We'll adjust pose difficulty accordingly." },
  { id: 'conditions', title: 'Any health goals?', subtitle: 'Select all that apply. Multi-select is fine.' },
  { id: 'goal', title: 'Primary goal in one line', subtitle: "e.g., 'Reduce my lower back pain' or 'Lose 5kg'." }
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()
  const { langCode } = useLanguage()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', age: '', gender: '', weight: '', height: '',
    fitnessLevel: 'beginner', conditions: [], goal: ''
  })
  const [dir, setDir] = useState(1)
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const errors = useMemo(() => validateOnboardingStep(step, form), [step, form])
  const stepValid = Object.keys(errors).length === 0

  // Live NLP detection on the free-text goal — shows the person their words
  // are actually being understood, not just stored.
  const detectedConditions = useMemo(() => extractConditionsFromText(form.goal, langCode), [form.goal, langCode])
  const newlyDetected = detectedConditions.filter(c => !form.conditions.includes(c))

  function next() {
    setAttempted(true)
    if (!stepValid) return
    setAttempted(false)
    setDir(1)
    setStep(s => s + 1)
  }
  function back() { setAttempted(false); setDir(-1); setStep(s => s - 1) }

  function toggleCondition(c) {
    setForm(f => ({
      ...f,
      conditions: f.conditions.includes(c) ? f.conditions.filter(x => x !== c) : [...f.conditions, c]
    }))
  }

  function acceptDetected(c) {
    setForm(f => ({ ...f, conditions: f.conditions.includes(c) ? f.conditions : [...f.conditions, c] }))
  }

  // Show a field's error as soon as it has content (live feedback for
  // out-of-range values) or once the person has tried to continue (catches
  // empty required fields without nagging before they've typed anything).
  function showError(field) {
    const val = form[field]
    const hasContent = val !== '' && val !== null && val !== undefined
    return Boolean(errors[field]) && (attempted || hasContent)
  }

  async function finish() {
    setAttempted(true)
    if (!stepValid) return
    setSubmitting(true)
    setServerError('')
    try {
      await completeOnboarding(form)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-night-deep flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-turmeric font-display text-xl">ॐ</span>
          <span className="font-display text-sandstone text-lg">YogaVedic</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-night-soft rounded-full mb-8">
          <motion.div className="h-1 bg-turmeric rounded-full" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.4 }} />
        </div>

        {/* Step label */}
        <p className="text-sandstone/40 text-xs font-mono mb-3 tracking-widest uppercase">Step {step + 1} of {STEPS.length}</p>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}>

            <h2 className="font-display text-3xl text-sandstone mb-1">{STEPS[step].title}</h2>
            <p className="text-sandstone/50 font-body text-sm mb-8">{STEPS[step].subtitle}</p>

            {/* Step 0: Name */}
            {step === 0 && (
              <div>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Shivakumar"
                  aria-invalid={showError('name')}
                  className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body text-base placeholder:text-sandstone/30 focus:outline-none transition-colors
                    ${showError('name') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`}
                  onKeyDown={e => e.key === 'Enter' && next()}
                />
                {showError('name') && <p className="text-terracotta text-xs font-body mt-2">{errors.name}</p>}
              </div>
            )}

            {/* Step 1: Basics */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sandstone/50 text-xs font-body mb-1.5 block">Age <span className="text-terracotta/70">*</span></span>
                    <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                      placeholder="25" min="10" max="100"
                      aria-invalid={showError('age')}
                      className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body focus:outline-none transition-colors
                        ${showError('age') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`} />
                    {showError('age') && <p className="text-terracotta text-xs font-body mt-1.5">{errors.age}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sandstone/50 text-xs font-body mb-1.5 block">Weight (kg)</span>
                    <input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                      placeholder="65"
                      aria-invalid={showError('weight')}
                      className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body focus:outline-none transition-colors
                        ${showError('weight') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`} />
                    {showError('weight') && <p className="text-terracotta text-xs font-body mt-1.5">{errors.weight}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sandstone/50 text-xs font-body mb-1.5 block">Height (cm)</span>
                    <input type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                      placeholder="170"
                      aria-invalid={showError('height')}
                      className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body focus:outline-none transition-colors
                        ${showError('height') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`} />
                    {showError('height') && <p className="text-terracotta text-xs font-body mt-1.5">{errors.height}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sandstone/50 text-xs font-body mb-1.5 block">Gender <span className="text-terracotta/70">*</span></span>
                    <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                      aria-invalid={showError('gender')}
                      className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body focus:outline-none transition-colors
                        ${showError('gender') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                    {showError('gender') && <p className="text-terracotta text-xs font-body mt-1.5">{errors.gender}</p>}
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Fitness level */}
            {step === 2 && (
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Beginner', sub: 'New to yoga or returning after a long break.' },
                  { value: 'intermediate', label: 'Intermediate', sub: 'Practice regularly, comfortable with most basic poses.' },
                  { value: 'advanced', label: 'Advanced', sub: 'Daily practice, comfortable with inversions and flows.' }
                ].map(opt => (
                  <button key={opt.value} onClick={() => setForm(f => ({ ...f, fitnessLevel: opt.value }))}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all
                      ${form.fitnessLevel === opt.value ? 'border-turmeric bg-turmeric/10 text-sandstone' : 'border-night-soft text-sandstone/60 hover:border-night-soft/80 hover:text-sandstone/80'}`}>
                    <p className="font-body font-semibold text-sm">{opt.label}</p>
                    <p className="font-body text-xs mt-0.5 opacity-60">{opt.sub}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Conditions */}
            {step === 3 && (
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map(c => (
                  <button key={c} onClick={() => toggleCondition(c)}
                    className={`px-4 py-2 rounded-full border text-sm font-body transition-all
                      ${form.conditions.includes(c) ? 'border-turmeric bg-turmeric/15 text-turmeric' : 'border-night-soft text-sandstone/60 hover:border-turmeric/40'}`}>
                    {c}
                  </button>
                ))}
                <button onClick={() => setForm(f => ({ ...f, conditions: [] }))}
                  className="px-4 py-2 rounded-full border border-dashed border-night-soft text-sandstone/30 text-xs font-body hover:border-sandstone/30 transition-all">
                  None / General Wellness
                </button>
              </div>
            )}

            {/* Step 4: Goal text */}
            {step === 4 && (
              <div>
                <textarea value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                  rows={3} maxLength={300} placeholder="e.g. I want to reduce my lower back pain and manage exam stress."
                  aria-invalid={showError('goal')}
                  className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body text-base placeholder:text-sandstone/30 focus:outline-none transition-colors resize-none
                    ${showError('goal') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`} />
                <div className="flex items-center justify-between mt-1.5">
                  {showError('goal')
                    ? <p className="text-terracotta text-xs font-body">{errors.goal}</p>
                    : <span />}
                  <p className="text-sandstone/25 text-xs font-mono">{form.goal.length}/300</p>
                </div>

                {/* NLP feedback — shows the AI actually understood the free text */}
                <AnimatePresence>
                  {newlyDetected.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-4 rounded-xl border border-sage/30 bg-sage/5 p-4">
                      <p className="text-sage text-xs font-body font-semibold mb-2 flex items-center gap-1.5">
                        <span>✨</span> Detected from what you wrote
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {newlyDetected.map(c => (
                          <button key={c} onClick={() => acceptDetected(c)}
                            className="px-3 py-1.5 rounded-full border border-sage/40 text-sage text-xs font-body hover:bg-sage/10 transition-all">
                            + {c}
                          </button>
                        ))}
                      </div>
                      <p className="text-sandstone/40 text-xs font-body mt-2">Tap to add to your health goals — they&rsquo;ll shape your routine automatically.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-10">
          {step > 0 && (
            <button onClick={back}
              className="px-5 py-3 rounded-xl border border-night-soft text-sandstone/60 font-body text-sm hover:text-sandstone transition-colors">
              Back
            </button>
          )}
          <button onClick={step < STEPS.length - 1 ? next : finish}
            disabled={submitting}
            className="flex-1 py-3 btn-glow text-night-deep font-body font-bold rounded-xl text-sm hover:bg-turmeric-light disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-98">
            {step < STEPS.length - 1 ? 'Continue' : (submitting ? 'Saving…' : 'Create My Routine →')}
          </button>
        </div>
        {attempted && !stepValid && (
          <p className="text-terracotta/80 text-xs font-body text-center mt-3">Please fix the highlighted field{Object.keys(errors).length > 1 ? 's' : ''} above to continue.</p>
        )}
        {serverError && (
          <p className="text-terracotta text-xs font-body text-center mt-3">{serverError}</p>
        )}
      </div>
    </div>
  )
}
