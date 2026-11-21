// PoseReference — YogaVedic
// The "Reference Pose" panel from the screenshots: an illustration of the
// target pose plus a short instruction list, with a "Full View" toggle that
// expands the illustration for a closer look at alignment.
//
// Renders the matching SVG from data/poseImages.jsx for the active pose's
// id. If a pose doesn't have an illustration yet, falls back gracefully to
// a simple lotus placeholder rather than a broken image.

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPoseIllustration } from '../data/poseImages.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

function PlaceholderIllustration() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="205" width="180" height="8" rx="4" fill="#2A2949" />
      <path d="M120,70 C90,90 85,140 120,170 C155,140 150,90 120,70 Z"
        fill="none" stroke="#F3EBDD" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="120" cy="55" r="14" fill="none" stroke="#F3EBDD" strokeWidth="5" />
    </svg>
  )
}

export default function PoseReference({ pose }) {
  const { t } = useLanguage()
  const [fullView, setFullView] = useState(false)

  if (!pose) return null

  const Illustration = getPoseIllustration(pose.id) || PlaceholderIllustration

  return (
    <div className="rounded-2xl glass-card hover-lift p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-body text-sandstone/40 uppercase tracking-widest flex items-center gap-1.5">
          <SearchIcon className="w-3.5 h-3.5" />
          {t('referencePose')}
        </p>
        <button
          onClick={() => setFullView(true)}
          className="text-xs font-body text-sandstone/50 hover:text-turmeric px-2.5 py-1 rounded-lg border border-night-soft transition-colors flex items-center gap-1"
        >
          <ExpandIcon className="w-3 h-3" />
          Full View
        </button>
      </div>

      <div className="rounded-xl bg-night-soft/40 overflow-hidden aspect-[4/3] flex items-center justify-center p-4">
        <Illustration />
      </div>

      <div className="mt-3">
        <h3 className="font-display text-lg text-sandstone">{pose.name}</h3>
        <p className="text-sage text-xs font-body italic">{pose.sanskrit}</p>
      </div>

      {pose.instructions?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {pose.instructions.map((ins, i) => (
            <li key={i} className="text-xs text-sandstone/60 font-body flex gap-2">
              <span className="text-turmeric mt-0.5 shrink-0">·</span>{ins}
            </li>
          ))}
        </ul>
      )}

      {/* Full-view modal */}
      <AnimatePresence>
        {fullView && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night-deep/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setFullView(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              className="bg-night rounded-2xl border border-night-soft/60 p-6 max-w-sm w-full glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl text-sandstone">{pose.name}</h3>
                  <p className="text-sage text-xs font-body italic">{pose.sanskrit}</p>
                </div>
                <button onClick={() => setFullView(false)}
                  className="text-sandstone/40 hover:text-sandstone p-1.5 rounded-lg">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="rounded-xl bg-night-soft/40 overflow-hidden aspect-[4/3] flex items-center justify-center p-6">
                <Illustration />
              </div>
              {pose.instructions?.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {pose.instructions.map((ins, i) => (
                    <li key={i} className="text-sm text-sandstone/70 font-body flex gap-2">
                      <span className="text-turmeric mt-0.5 shrink-0">·</span>{ins}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  )
}
function ExpandIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
    </svg>
  )
}
function CloseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
