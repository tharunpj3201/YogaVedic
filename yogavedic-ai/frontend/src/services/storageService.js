// Storage Service — YogaVedic
// Wraps localStorage with typed helpers. All data lives client-side for demo
// reliability. Backend sync is called separately when available.

const KEYS = {
  PROFILE: 'yv_profile',
  SESSIONS: 'yv_sessions',
  CURRENT_ROUTINE: 'yv_current_routine',
  SETTINGS: 'yv_settings'
}

// ─── Profile ────────────────────────────────────────────────────────────────
export function saveProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile))
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function notifySessionsChanged() {
  window.dispatchEvent(new Event('yv:sessions-updated'))
}

// ─── Sessions ───────────────────────────────────────────────────────────────
export function saveSession(session) {
  const sessions = loadSessions()
  sessions.unshift({ ...session, id: `s_${Date.now()}` })
  // Keep last 60 sessions
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 60)))
  notifySessionsChanged()
}

export function loadSessions() {
  try {
    const raw = localStorage.getItem(KEYS.SESSIONS)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function clearSessions() {
  localStorage.removeItem(KEYS.SESSIONS)
  notifySessionsChanged()
}

// Clears everything tied to a specific account (profile, session history,
// in-progress routine) — called on logout so the next person on this
// browser/device doesn't see the previous account's data. Device-level
// preferences (KEYS.SETTINGS) are intentionally left alone.
export function clearLocalAccountData() {
  localStorage.removeItem(KEYS.PROFILE)
  localStorage.removeItem(KEYS.SESSIONS)
  localStorage.removeItem(KEYS.CURRENT_ROUTINE)
}

// ─── Computed stats ──────────────────────────────────────────────────────────
export function computeStats(sessions) {
  if (!sessions || sessions.length === 0) {
    return { totalSessions: 0, totalMinutes: 0, avgAccuracy: 0, totalCalories: 0, streak: 0, weeklyData: [] }
  }

  const totalSessions = sessions.length
  const totalMinutes = Math.round(sessions.reduce((s, x) => s + (x.durationMin || 0), 0))
  const totalCalories = Math.round(sessions.reduce((s, x) => s + (x.calories || 0), 0))
  const avgAccuracy = Math.round(sessions.reduce((s, x) => s + (x.accuracy || 0), 0) / totalSessions)

  // Streak: consecutive days with at least one session (capped at 10 years
  // as a defensive bound — this is a UI stat, not a data source it should
  // ever need to walk further back than that for).
  const dateSet = new Set(sessions.map(s => s.date?.split('T')[0]).filter(Boolean))
  let streak = 0
  let day = new Date()
  for (let guard = 0; guard < 3650; guard++) {
    const key = day.toISOString().split('T')[0]
    if (!dateSet.has(key)) break
    streak++
    day.setDate(day.getDate() - 1)
  }

  // Weekly data for chart (last 7 days)
  const weeklyData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' })
    const daysSessions = sessions.filter(s => s.date?.startsWith(key))
    weeklyData.push({
      day: label,
      sessions: daysSessions.length,
      minutes: Math.round(daysSessions.reduce((s, x) => s + (x.durationMin || 0), 0)),
      accuracy: daysSessions.length ? Math.round(daysSessions.reduce((s, x) => s + (x.accuracy || 0), 0) / daysSessions.length) : 0
    })
  }

  return { totalSessions, totalMinutes, avgAccuracy, totalCalories, streak, weeklyData }
}

// ─── Current Routine ─────────────────────────────────────────────────────────
export function saveCurrentRoutine(routine) {
  localStorage.setItem(KEYS.CURRENT_ROUTINE, JSON.stringify(routine))
}

export function loadCurrentRoutine() {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_ROUTINE)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// ─── Settings ────────────────────────────────────────────────────────────────
export function saveSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS)
    return raw ? JSON.parse(raw) : { voiceEnabled: true, darkMode: true }
  } catch { return { voiceEnabled: true, darkMode: true } }
}

// ─── Backend sync ────────────────────────────────────────────────────────────
// Called after login to populate the local cache with the account's real
// session history from the server, so the dashboard (which reads local
// cache for instant paint) reflects the account rather than this browser only.
export function replaceSessionsFromBackend(backendSessions) {
  const mapped = (backendSessions || []).map(s => ({
    id: s._id || `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    date: s.completedAt,
    routineTitle: s.routineTitle,
    durationMin: s.durationMin,
    accuracy: s.accuracy,
    calories: s.calories,
    posesCompleted: s.posesCompleted,
    poseResults: s.poseResults
  }))
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(mapped.slice(0, 60)))
  notifySessionsChanged()
}
