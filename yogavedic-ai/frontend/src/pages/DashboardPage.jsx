import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useApp } from '../App.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { loadSessions, computeStats } from '../services/storageService.js'
import StatCard from '../components/StatCard.jsx'

export default function DashboardPage() {
  const { profile } = useApp()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState(() => loadSessions())

  // The account's real session history may still be syncing in from the
  // backend (fired right after login) — re-read the cache whenever that
  // finishes, so a returning user on a new device doesn't see a stale
  // empty dashboard until they manually refresh.
  useEffect(() => {
    function refresh() { setSessions(loadSessions()) }
    window.addEventListener('yv:sessions-updated', refresh)
    return () => window.removeEventListener('yv:sessions-updated', refresh)
  }, [])

  const stats = useMemo(() => computeStats(sessions), [sessions])

  const recentSessions = sessions.slice(0, 5)

  const tooltipStyle = {
    backgroundColor: '#2A2949', border: '1px solid #3a3960',
    borderRadius: '8px', color: '#F3EBDD', fontSize: '12px', fontFamily: 'Manrope, sans-serif'
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-3xl text-sandstone mb-1">
          {t('dashboardGreetingPrefix')} <span className="text-turmeric italic">{profile.name || t('yogiFallback')}</span> 🙏
        </h1>
        <p className="text-sandstone/50 font-body text-sm">
          {stats.streak > 0 ? `🔥 ${stats.streak}${t('dayStreakSuffix')}` : t('startFirstSessionToday')}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('statSessions')} value={stats.totalSessions} color="turmeric" delay={0} />
        <StatCard label={t('statMinutes')} value={stats.totalMinutes} color="sage" delay={0.08} />
        <StatCard label={t('statAvgAccuracy')} value={`${stats.avgAccuracy}`} unit="%" color="terracotta" delay={0.16} />
        <StatCard label={t('statCalories')} value={stats.totalCalories} unit="kcal" color="sandstone" delay={0.24} />
      </div>

      {/* Start practice CTA */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-turmeric/20 via-sage/10 to-transparent border border-turmeric/25 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-turmeric">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-turmeric/20 blur-3xl animate-glow-pulse pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-display text-xl text-sandstone mb-1">{t('readyForPractice')}</h2>
          <p className="text-sandstone/50 font-body text-sm">{t('aiCoachCalibrated')}</p>
        </div>
        <button onClick={() => navigate('/routine')}
          className="relative z-10 shrink-0 px-6 py-3 btn-glow text-night-deep font-body font-bold rounded-xl active:scale-95 transition-all text-sm">
          {t('chooseRoutine')}
        </button>
      </motion.div>

      {/* Weekly chart */}
      {stats.weeklyData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="rounded-2xl glass-card hover-lift p-6">
          <h3 className="font-display text-lg text-sandstone mb-5">{t('accuracyThisWeek')}</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={stats.weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A33D" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#E8A33D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#4a4870" tick={{ fill: '#F3EBDD60', fontSize: 11, fontFamily: 'Manrope' }} />
              <YAxis domain={[0, 100]} stroke="#4a4870" tick={{ fill: '#F3EBDD60', fontSize: 11, fontFamily: 'Manrope' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Accuracy']} />
              <Area type="monotone" dataKey="accuracy" stroke="#E8A33D" fill="url(#accGrad)" strokeWidth={2} dot={{ fill: '#E8A33D', strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Weekly minutes bar chart */}
      {stats.weeklyData.some(d => d.minutes > 0) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="rounded-2xl glass-card hover-lift p-6">
          <h3 className="font-display text-lg text-sandstone mb-5">{t('minutesPractised')}</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={stats.weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#4a4870" tick={{ fill: '#F3EBDD60', fontSize: 11, fontFamily: 'Manrope' }} />
              <YAxis stroke="#4a4870" tick={{ fill: '#F3EBDD60', fontSize: 11, fontFamily: 'Manrope' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} min`, 'Duration']} />
              <Bar dataKey="minutes" fill="#7C9C7A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="rounded-2xl glass-card hover-lift p-6">
          <h3 className="font-display text-lg text-sandstone mb-4">{t('recentSessions')}</h3>
          <div className="space-y-2">
            {recentSessions.map((s, i) => (
              <div key={s.id || i} className="flex items-center justify-between py-3 border-b border-night-soft/30 last:border-0">
                <div>
                  <p className="text-sandstone text-sm font-body font-medium">{s.routineTitle}</p>
                  <p className="text-sandstone/40 text-xs font-body mt-0.5">
                    {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {' · '}{s.durationMin} min · {s.posesCompleted} poses
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-mono font-semibold ${s.accuracy >= 75 ? 'text-sage' : s.accuracy >= 50 ? 'text-turmeric' : 'text-terracotta'}`}>
                    {s.accuracy}%
                  </span>
                  <span className="text-sandstone/30 text-xs font-body">{s.calories} kcal</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {sessions.length === 0 && (
        <div className="text-center py-16">
          <p className="font-display text-2xl text-sandstone/30 mb-2">{t('journeyStartsToday')}</p>
          <p className="text-sandstone/30 text-sm font-body">{t('completeFirstSessionStats')}</p>
        </div>
      )}
    </div>
  )
}
