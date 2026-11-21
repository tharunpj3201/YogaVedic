import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { validateLoginForm } from '../utils/validation.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const errors = useMemo(() => validateLoginForm(form), [form])
  const isValid = Object.keys(errors).length === 0

  function showError(field) {
    return Boolean(errors[field]) && attempted
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setAttempted(true)
    setServerError('')
    if (!isValid) return
    setSubmitting(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-night-deep bg-mesh-hero flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-turmeric/10 blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-[10%] right-[15%] w-64 h-64 rounded-full bg-sage/10 blur-3xl pointer-events-none animate-float" style={{ animationDelay: '3s' }} />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="w-full max-w-sm glass-card rounded-2xl p-8 relative z-10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-full bg-gold-gradient shadow-glow-turmeric flex items-center justify-center text-night-deep font-display font-bold text-sm">ॐ</div>
          <span className="font-display text-sandstone text-lg">YogaVedic</span>
        </div>

        <h1 className="font-display text-2xl text-sandstone text-center mb-1">{t('loginWelcomeBack')}</h1>
        <p className="text-sandstone/40 font-body text-sm text-center mb-8">{t('loginSubtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {serverError && (
            <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl px-4 py-3 text-terracotta text-sm font-body">
              {serverError}
            </div>
          )}

          <label className="block">
            <span className="text-sandstone/50 text-xs font-body mb-1.5 block">{t('emailLabel')}</span>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com" autoComplete="email"
              aria-invalid={showError('email')}
              className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body text-sm placeholder:text-sandstone/30 focus:outline-none transition-colors
                ${showError('email') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`} />
            {showError('email') && <p className="text-terracotta text-xs font-body mt-1.5">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-sandstone/50 text-xs font-body mb-1.5 block">{t('passwordLabel')}</span>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••" autoComplete="current-password"
              aria-invalid={showError('password')}
              className={`w-full bg-night-deep/60 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-turmeric/20 text-sandstone font-body text-sm placeholder:text-sandstone/30 focus:outline-none transition-colors
                ${showError('password') ? 'border-terracotta focus:border-terracotta' : 'border-night-soft focus:border-turmeric/60'}`} />
            {showError('password') && <p className="text-terracotta text-xs font-body mt-1.5">{errors.password}</p>}
          </label>

          <button type="submit" disabled={submitting}
            className="w-full py-3 btn-glow text-night-deep font-body font-bold rounded-xl text-sm hover:bg-turmeric-light disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-98">
            {submitting ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <p className="text-sandstone/40 font-body text-sm text-center mt-6">
          {t('newHereQ')} <Link to="/register" className="text-turmeric hover:text-turmeric-light transition-colors">{t('createAnAccount')}</Link>
        </p>
      </motion.div>
    </div>
  )
}
