import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../App.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { generateRoutine, getQuickRoutines } from '../services/routineGenerator.js'
import { saveCurrentRoutine } from '../services/storageService.js'

const DURATION_OPTIONS = [10, 15, 20, 30]
const GOALS = [
  { value: 'student', labelKey: 'goalStudentFocus', emoji: '📚' },
  { value: 'corporate', labelKey: 'goalDeskRecovery', emoji: '💼' },
  { value: 'back_pain', labelKey: 'goalBackCare', emoji: '🧘' },
  { value: 'stress', labelKey: 'goalStressRelief', emoji: '😮‍💨' },
  { value: 'weight_loss', labelKey: 'goalWeightLoss', emoji: '🔥' },
  { value: 'diabetes', labelKey: 'goalMetabolicBalance', emoji: '💊' },
  { value: 'flexibility', labelKey: 'goalFlexibility', emoji: '🤸' }
]

// Category chips on the generated routine (e.g. "back_pain") map to
// localized labels via these ui.* keys.
const CATEGORY_LABEL_KEYS = {
  back_pain: 'categoryBackPain',
  stress_relief: 'categoryStressRelief',
  weight_loss: 'categoryWeightLoss',
  diabetes_support: 'categoryMetabolicBalance',
  flexibility: 'categoryFlexibility',
  student_wellness: 'categoryStudentWellness',
  corporate_wellness: 'categoryCorporateWellness'
}

export default function RoutinePage() {
  const { profile, setCurrentRoutine } = useApp()
  const { langCode, t } = useLanguage()
  const navigate = useNavigate()
  const [duration, setDuration] = useState(15)
  const [goal, setGoal] = useState('')
  const [generated, setGenerated] = useState(null)
  const [view, setView] = useState('builder') // builder | preview

  function generate() {
    const routine = generateRoutine({
      durationMin: duration,
      conditions: profile.conditions || [],
      fitnessLevel: profile.fitnessLevel || 'beginner',
      age: parseInt(profile.age) || 25,
      goal: goal || profile.goal || '',
      langCode
    })
    setGenerated(routine)
    setView('preview')
  }

  function startSession() {
    setCurrentRoutine(generated)
    saveCurrentRoutine(generated)
    navigate('/session')
  }

  function startQuickRoutine(qr) {
    const routine = generateRoutine({ ...qr, langCode })
    setCurrentRoutine(routine)
    saveCurrentRoutine(routine)
    navigate('/session')
  }

  const phaseColors = { warmup: 'text-sage', core: 'text-turmeric', cooldown: 'text-terracotta' }
  const phaseKey = { warmup: 'phaseWarmup', core: 'phaseCore', cooldown: 'phaseCooldown' }
  const fitnessLevelKey = { beginner: 'levelBeginner', intermediate: 'levelIntermediate', advanced: 'levelAdvanced' }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl text-sandstone mb-1">{t('routineBuilderTitle')}</h1>
        <p className="text-sandstone/50 font-body text-sm">{t('routineBuilderSubtitle')}</p>
      </div>

      {view === 'builder' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Quick start */}
          <div>
            <h2 className="font-body text-sandstone/60 text-xs uppercase tracking-widest mb-3">{t('quickStart')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getQuickRoutines(langCode).map(qr => (
                <button key={qr.labelKey} onClick={() => startQuickRoutine(qr)}
                  className="text-left p-4 rounded-2xl bg-night border border-night-soft hover:border-turmeric/40 hover-lift hover:shadow-glow-turmeric transition-all group">
                  <p className="text-sandstone text-sm font-body font-semibold group-hover:text-turmeric transition-colors">{qr.label}</p>
                  <p className="text-sandstone/40 text-xs mt-1 font-body">{t(fitnessLevelKey[qr.fitnessLevel] || 'levelBeginner')}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom builder */}
          <div className="rounded-2xl glass-card hover-lift p-6 space-y-6">
            <h2 className="font-display text-xl text-sandstone">{t('customBuilder')}</h2>

            <div>
              <p className="text-sandstone/50 text-xs font-body uppercase tracking-widest mb-3">{t('durationLabel')}</p>
              <div className="flex gap-3">
                {DURATION_OPTIONS.map(d => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-xl border text-sm font-body font-medium transition-all
                      ${duration === d ? 'bg-turmeric/15 border-turmeric text-turmeric' : 'border-night-soft text-sandstone/60 hover:border-turmeric/30'}`}>
                    {d} {t('minUnit')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sandstone/50 text-xs font-body uppercase tracking-widest mb-3">{t('todaysFocus')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GOALS.map(g => (
                  <button key={g.value} onClick={() => setGoal(g.value === goal ? '' : g.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-body transition-all
                      ${goal === g.value ? 'bg-turmeric/15 border-turmeric text-turmeric' : 'border-night-soft text-sandstone/60 hover:border-turmeric/30'}`}>
                    <span>{g.emoji}</span>{t(g.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sandstone/50 text-xs font-body uppercase tracking-widest mb-2">{t('fitnessLevel')}</p>
              <p className="text-sandstone/70 text-sm font-body">
                {t('usingYourProfile')} <span className="text-turmeric capitalize">{t(fitnessLevelKey[profile.fitnessLevel] || 'levelBeginner')}</span>
                <button onClick={() => navigate('/profile')} className="ml-2 text-sandstone/30 text-xs hover:text-sandstone/60 underline">{t('changeLink')}</button>
              </p>
            </div>

            <button onClick={generate}
              className="w-full py-3.5 btn-glow text-night-deep font-body font-bold rounded-xl active:scale-98 transition-all text-sm">
              {t('generateRoutine')}
            </button>
          </div>
        </motion.div>
      )}

      {view === 'preview' && generated && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Routine header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-turmeric/15 via-sage/10 to-transparent border border-turmeric/25 shadow-glow-turmeric p-6">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-turmeric/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-2xl text-sandstone">{generated.title}</h2>
                <p className="text-sandstone/50 text-sm font-body mt-1">
                  {generated.totalPoses} {t('posesUnit')} · {generated.durationMin} {t('minUnit')} · ~{generated.estimatedCalories} {t('kcalUnit')}
                </p>
              </div>
              <button onClick={() => setView('builder')} className="text-sandstone/40 text-xs font-body hover:text-sandstone/70">{t('rebuild')}</button>
            </div>
            <div className="relative z-10 flex gap-2 flex-wrap">
              {generated.targetCategories.map(c => (
                <span key={c} className="px-2.5 py-1 rounded-full bg-night-soft text-sandstone/60 text-xs font-body capitalize">
                  {t(CATEGORY_LABEL_KEYS[c] || 'holisticFlow')}
                </span>
              ))}
            </div>
          </div>

          {/* Sequence */}
          <div className="rounded-2xl glass-card hover-lift p-6">
            <h3 className="font-display text-lg text-sandstone mb-4">{t('sequenceLabel')}</h3>
            <div className="space-y-0">
              {generated.sequence.map((pose, i) => (
                <div key={pose.id + i} className="flex items-start gap-4 py-3.5 border-b border-night-soft/30 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-night-soft flex items-center justify-center text-xs text-sandstone/40 font-mono shrink-0 mt-0.5">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sandstone font-body font-medium text-sm">{pose.name}</p>
                      <span className={`text-xs font-mono capitalize ${phaseColors[pose.phase]}`}>{t(phaseKey[pose.phase] || 'phaseCore')}</span>
                    </div>
                    <p className="text-sandstone/40 text-xs font-body italic">{pose.sanskrit}</p>
                    <p className="text-sandstone/50 text-xs font-body mt-1 line-clamp-1">{pose.benefits}</p>
                  </div>
                  <span className="text-sandstone/40 text-xs font-mono shrink-0 mt-1">{pose.assignedDurationSec}s</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <button onClick={startSession}
            className="w-full py-4 btn-glow text-night-deep font-body font-bold rounded-2xl text-base active:scale-98 transition-all">
            {t('startSessionCta')}
          </button>
        </motion.div>
      )}
    </div>
  )
}
