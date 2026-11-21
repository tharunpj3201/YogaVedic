import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../App.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { clearLocalAccountData } from '../services/storageService.js'
import LanguageSelector from './LanguageSelector.jsx'
import ChatAssistant from './ChatAssistant.jsx'

export default function Layout() {
  const { profile } = useApp()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const NAV_ITEMS = [
    { to: '/dashboard', label: t('navDashboard'), icon: GridIcon },
    { to: '/routine', label: t('navRoutines'), icon: LeafIcon },
    { to: '/session', label: t('navPractice'), icon: PersonIcon },
    { to: '/profile', label: t('navProfile'), icon: UserIcon }
  ]

  function handleLogout() {
    clearLocalAccountData()
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-night-deep flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-night/80 backdrop-blur-xl border-r border-night-soft/60 py-6 px-4 relative z-10">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-10 group">
          <div className="w-8 h-8 rounded-full bg-gold-gradient shadow-glow-turmeric flex items-center justify-center text-night-deep font-display font-bold text-sm">ॐ</div>
          <span className="font-display text-sandstone text-lg font-semibold group-hover:text-turmeric transition-colors">YogaVedic</span>
        </button>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all
                 ${isActive ? 'bg-gradient-to-r from-turmeric/20 to-turmeric/5 text-turmeric shadow-inner-glow border border-turmeric/20' : 'text-sandstone/60 hover:text-sandstone hover:bg-night-soft/40 border border-transparent'}`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 pt-4 border-t border-night-soft/50">
          <p className="text-xs text-sandstone/40 font-body px-3">{t('loggedInAs')}</p>
          <p className="text-sm text-sandstone font-medium px-3 truncate mb-3">{profile.name || t('yogiFallback')}</p>
          <button onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-body text-sandstone/50 hover:text-sandstone hover:bg-night-soft/40 transition-all">
            {t('logOut')}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-night/90 backdrop-blur-xl border-t border-night-soft/60 flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-body transition-colors
               ${isActive ? 'text-turmeric' : 'text-sandstone/50'}`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 pt-4 md:px-8 md:pt-6 flex justify-end">
          <LanguageSelector />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </main>
      <ChatAssistant />
    </div>
  )
}

// Minimal inline SVG icons — no icon library dependency
function GridIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  )
}
function LeafIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22C6 22 3 17 3 12C3 7 8 3 14 3C18 3 21 6 21 10C21 14 18 17 14 17H12" />
      <path d="M12 17L12 22" />
    </svg>
  )
}
function PersonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
    </svg>
  )
}
function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}
