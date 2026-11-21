import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { clearSessions, clearLocalAccountData } from '../services/storageService.js'
import { api } from '../services/apiClient.js'
import { validateProfileForm } from '../utils/validation.js'
import { extractConditionsFromText } from '../services/nlpService.js'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useApp()
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...profile })
  const [cleared, setCleared] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const errors = useMemo(() => validateProfileForm(form), [form])
  const isValid = Object.keys(errors).length === 0

  const detectedGoalConditions = useMemo(() => extractConditionsFromText(form.goal), [form.goal])
  const newlyDetectedGoalConditions = detectedGoalConditions.filter(c => !(form.conditions || []).includes(c))

  async function save() {
    setAttempted(true)
    if (!isValid) return
    setSubmitting(true)
    setServerError('')
    try {
      await updateProfile(form)
      setEditing(false)
      setAttempted(false)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleLogout() {
    clearLocalAccountData()
    logout()
    navigate('/login')
  }

  function handleClear() {
    if (window.confirm(t('clearHistoryConfirm'))) {
      clearSessions()
      api.clearSessions().catch(() => { /* local cache is already cleared; server clear will just be retried on next load if it failed */ })
      setCleared(true)
    }
  }

  const bmi = form.weight && form.height
    ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
    : null
  const bmiLabel = bmi ? (bmi < 18.5 ? t('bmiUnderweight') : bmi < 25 ? t('bmiNormal') : bmi < 30 ? t('bmiOverweight') : t('bmiObese')) : null
  const bmiColor = bmi ? (bmi < 18.5 ? 'text-terracotta' : bmi < 25 ? 'text-sage' : bmi < 30 ? 'text-turmeric' : 'text-terracotta') : ''

  return (
    <div className="space-y-8 animate-fade-up max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-sandstone">{t('profileTitle')}</h1>
        {!editing
          ? <button onClick={() => { setForm({ ...profile }); setEditing(true) }}
              className="px-4 py-2 border border-night-soft text-sandstone/70 text-sm font-body rounded-xl hover:border-turmeric/40 transition-all">
              {t('edit')}
            </button>
          : <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setAttempted(false); setServerError('') }}
                className="px-4 py-2 border border-night-soft text-sandstone/50 text-sm font-body rounded-xl">{t('cancel')}</button>
              <button onClick={save} disabled={submitting}
                className="px-4 py-2 bg-turmeric text-night-deep font-bold text-sm font-body rounded-xl hover:bg-turmeric-light disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? t('saving') : t('save')}
              </button>
            </div>
        }
      </div>
      {editing && attempted && !isValid && (
        <p className="text-terracotta text-xs font-body -mt-4">{t('fixHighlightedFields')}</p>
      )}
      {serverError && (
        <p className="text-terracotta text-xs font-body -mt-4">{serverError}</p>
      )}

      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gold-gradient shadow-glow-turmeric flex items-center justify-center">
          <span className="font-display text-2xl text-night-deep font-semibold">{(profile.name || 'Y')[0].toUpperCase()}</span>
        </div>
        <div>
          <p className="font-display text-xl text-sandstone">{profile.name || t('yogiFallback')}</p>
          <p className="text-sandstone/50 text-sm font-body">{user?.email}</p>
          <p className="text-sandstone/40 text-xs font-body capitalize mt-0.5">{profile.fitnessLevel || t('levelBeginner')} {t('practitioner')}</p>
        </div>
      </div>

      {/* Stats row */}
      {bmi && (
        <div className="flex gap-4">
          <div className="flex-1 rounded-xl glass-card hover-lift p-4 text-center">
            <p className="font-display text-2xl text-sandstone">{bmi}</p>
            <p className={`text-xs font-body mt-0.5 ${bmiColor}`}>{bmiLabel}</p>
            <p className="text-sandstone/40 text-xs font-body mt-0.5">{t('bmiLabel')}</p>
          </div>
          <div className="flex-1 rounded-xl glass-card hover-lift p-4 text-center">
            <p className="font-display text-2xl text-sandstone">{profile.weight || '—'}</p>
            <p className="text-sandstone/40 text-xs font-body mt-0.5">kg</p>
          </div>
          <div className="flex-1 rounded-xl glass-card hover-lift p-4 text-center">
            <p className="font-display text-2xl text-sandstone">{profile.height || '—'}</p>
            <p className="text-sandstone/40 text-xs font-body mt-0.5">cm</p>
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="rounded-2xl glass-card hover-lift p-6 space-y-5">
        {[
          { label: t('fieldName'), key: 'name', type: 'text' },
          { label: t('fieldAge'), key: 'age', type: 'number' },
          { label: t('fieldWeightKg'), key: 'weight', type: 'number' },
          { label: t('fieldHeightCm'), key: 'height', type: 'number' }
        ].map(field => {
          const fieldError = errors[field.key]
          const showFieldError = editing && fieldError && (attempted || (form[field.key] !== '' && form[field.key] != null))
          return (
            <div key={field.key}>
              <p className="text-sandstone/40 text-xs font-body uppercase tracking-widest mb-1.5">{field.label}</p>
              {editing
                ? <>
                    <input type={field.type} value={form[field.key] || ''} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      aria-invalid={showFieldError}
                      className={`w-full bg-night-deep border rounded-lg px-3 py-2.5 text-sandstone font-body text-sm focus:outline-none transition-colors
                        ${showFieldError ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`} />
                    {showFieldError && <p className="text-terracotta text-xs font-body mt-1.5">{fieldError}</p>}
                  </>
                : <p className="text-sandstone font-body text-sm">{profile[field.key] || <span className="text-sandstone/30">{t('notSet')}</span>}</p>
              }
            </div>
          )
        })}

        <div>
          <p className="text-sandstone/40 text-xs font-body uppercase tracking-widest mb-1.5">{t('fitnessLevel')}</p>
          {editing
            ? <select value={form.fitnessLevel} onChange={e => setForm(f => ({ ...f, fitnessLevel: e.target.value }))}
                className="w-full bg-night-deep border border-night-soft rounded-lg px-3 py-2.5 text-sandstone font-body text-sm focus:outline-none focus:border-turmeric/60 transition-colors">
                <option value="beginner">{t('levelBeginner')}</option>
                <option value="intermediate">{t('levelIntermediate')}</option>
                <option value="advanced">{t('levelAdvanced')}</option>
              </select>
            : <p className="text-sandstone font-body text-sm capitalize">{profile.fitnessLevel || t('levelBeginner')}</p>
          }
        </div>

        <div>
          <p className="text-sandstone/40 text-xs font-body uppercase tracking-widest mb-1.5">{t('healthConditionsGoals')}</p>
          <div className="flex flex-wrap gap-2">
            {(profile.conditions || []).length > 0
              ? (profile.conditions || []).map(c => (
                  <span key={c} className="px-3 py-1 rounded-full bg-turmeric/10 border border-turmeric/20 text-turmeric text-xs font-body">{c}</span>
                ))
              : <span className="text-sandstone/30 text-sm font-body">{t('noneSelected')}</span>
            }
          </div>
        </div>

        <div>
          <p className="text-sandstone/40 text-xs font-body uppercase tracking-widest mb-1.5">{t('primaryGoal')}</p>
          {editing
            ? <>
                <textarea value={form.goal || ''} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                  rows={2} maxLength={300} placeholder={t('goalPlaceholder')}
                  className="w-full bg-night-deep border border-night-soft rounded-lg px-3 py-2.5 text-sandstone font-body text-sm placeholder:text-sandstone/30 focus:outline-none focus:border-turmeric/60 transition-colors resize-none" />
                {newlyDetectedGoalConditions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-sage text-xs font-body">{t('detectedPrefix')}</span>
                    {newlyDetectedGoalConditions.map(c => (
                      <button key={c} type="button"
                        onClick={() => setForm(f => ({ ...f, conditions: [...(f.conditions || []), c] }))}
                        className="px-2.5 py-0.5 rounded-full border border-sage/40 text-sage text-xs font-body hover:bg-sage/10 transition-all">
                        + {c}
                      </button>
                    ))}
                  </div>
                )}
              </>
            : profile.goal
              ? <p className="text-sandstone/80 text-sm font-body italic">&ldquo;{profile.goal}&rdquo;</p>
              : <span className="text-sandstone/30 text-sm font-body">{t('notSet')}</span>
          }
        </div>
      </div>

      {/* Account */}
      <div className="rounded-2xl glass-card hover-lift p-6">
        <h3 className="font-body font-semibold text-sandstone/70 text-sm mb-3">{t('account')}</h3>
        <button onClick={handleLogout}
          className="px-4 py-2 border border-night-soft text-sandstone/70 text-sm font-body rounded-xl hover:border-turmeric/40 hover:text-sandstone transition-all">
          {t('logOut')}
        </button>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl bg-night/60 backdrop-blur-sm border border-terracotta/25 p-6">
        <h3 className="font-body font-semibold text-sandstone/70 text-sm mb-3">{t('data')}</h3>
        <button onClick={handleClear}
          className="px-4 py-2 border border-terracotta/30 text-terracotta text-sm font-body rounded-xl hover:bg-terracotta/10 transition-all">
          {t('clearSessionHistory')}
        </button>
        {cleared && <p className="text-sage text-xs font-body mt-2">{t('historyCleared')}</p>}
      </div>

      <p className="text-sandstone/20 text-xs font-body text-center">
        {t('appTagline')}
      </p>
    </div>
  )
}
