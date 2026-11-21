import React, { createContext, useContext, useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { api } from './services/apiClient.js'
import { loadSettings, saveSettings, replaceSessionsFromBackend } from './services/storageService.js'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import Layout from './components/Layout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RoutinePage from './pages/RoutinePage.jsx'
import SessionPage from './pages/SessionPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

export const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

const DEFAULT_PROFILE = {
  name: '', age: '', gender: '', weight: '', height: '',
  fitnessLevel: 'beginner', conditions: [], goal: '', onboardingComplete: false
}

function deriveProfile(user) {
  if (!user) return DEFAULT_PROFILE
  return {
    name: user.name || '',
    age: user.profile?.age ?? '',
    gender: user.profile?.gender || '',
    weight: user.profile?.weight ?? '',
    height: user.profile?.height ?? '',
    fitnessLevel: user.profile?.fitnessLevel || 'beginner',
    conditions: user.profile?.conditions || [],
    goal: user.profile?.goal || '',
    onboardingComplete: Boolean(user.profile?.onboardingComplete)
  }
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-night-deep flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-turmeric font-display text-2xl animate-pulse">ॐ</span>
        <p className="text-sandstone/40 font-body text-sm">Loading YogaVedic…</p>
      </div>
    </div>
  )
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function RequireOnboarding({ children }) {
  const { profile } = useApp()
  if (!profile.onboardingComplete) return <Navigate to="/onboarding" replace />
  return children
}

function AppRoutes() {
  const { user, loading: authLoading, refreshUser } = useAuth()
  const [settings, setSettings] = useState(() => loadSettings())
  const [currentRoutine, setCurrentRoutine] = useState(null)
  const profile = deriveProfile(user)

  // Pull this account's real session history into the local cache once,
  // right after we know who's signed in — the dashboard reads the cache
  // for instant paint, so this keeps it accurate across devices/browsers.
  useEffect(() => {
    if (!user) return
    api.listSessions('?limit=60').then(({ sessions }) => {
      replaceSessionsFromBackend(sessions)
    }).catch(() => { /* offline or first-time account — local cache stays empty, that's correct */ })
  // Intentionally keyed on user._id only: this should re-sync once per
  // login, not on every subsequent profile edit (which also produces a
  // new `user` object reference).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode !== false)
  }, [settings.darkMode])

  function updateSettings(updates) {
    const next = { ...settings, ...updates }
    saveSettings(next)
    setSettings(next)
  }

  // Both onboarding completion and profile edits go through the same path:
  // merge into the current profile, persist to the account, then refresh
  // the cached user so every consumer of useApp() sees the update.
  async function persistProfile(updates) {
    const merged = { ...profile, ...updates }
    const { name, ...rest } = merged
    await api.updateProfile({ name, profile: rest })
    await refreshUser()
  }

  const ctx = {
    profile,
    updateProfile: persistProfile,
    completeOnboarding: (data) => persistProfile({ ...data, onboardingComplete: true }),
    settings, updateSettings,
    currentRoutine, setCurrentRoutine
  }

  if (authLoading) return <FullScreenLoader />

  return (
    <AppContext.Provider value={ctx}>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<RequireAuth><OnboardingPage /></RequireAuth>} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/dashboard" element={
              <RequireOnboarding><DashboardPage /></RequireOnboarding>
            } />
            <Route path="/routine" element={
              <RequireOnboarding><RoutinePage /></RequireOnboarding>
            } />
            <Route path="/session" element={
              <RequireOnboarding><SessionPage /></RequireOnboarding>
            } />
            <Route path="/profile" element={
              <RequireOnboarding><ProfilePage /></RequireOnboarding>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </AppContext.Provider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
