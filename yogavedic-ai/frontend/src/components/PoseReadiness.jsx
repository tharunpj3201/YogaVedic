// PoseReadiness — YogaVedic
// The "POSE READINESS" ring + "REAL-TIME FEEDBACK" checklist from the
// screenshots. Takes the live checkResults array from useMediaPipe's
// onFeedback callback (already localized) and renders each check with a
// Good / Adjust / Work on it tag.

import React from 'react'
import AccuracyRing from './AccuracyRing.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

// Short, human label for each checkId — shown left of the status tag.
// Falls back to a title-cased version of the id if not mapped.
const CHECK_LABELS = {
  spine_alignment: 'Back Alignment',
  shoulder_level: 'Shoulder Position',
  standing_leg_straight: 'Standing Leg',
  raised_knee_height: 'Raised Knee',
  front_knee_angle: 'Front Knee Angle',
  arms_extended: 'Arm Extension',
  front_leg_straight: 'Front Leg',
  top_arm_raised: 'Top Arm',
  seated_spine: 'Spine Posture'
}

function labelFor(checkId) {
  return CHECK_LABELS[checkId] || checkId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function PoseReadiness({ checkResults, accuracy }) {
  const { t } = useLanguage()
  const hasChecks = checkResults && checkResults.length > 0

  return (
    <div className="rounded-2xl glass-card hover-lift p-5 space-y-5">
      {/* Readiness ring */}
      <div>
        <p className="text-xs font-body text-sandstone/40 uppercase tracking-widest mb-3">
          {t('poseReadiness')}
        </p>
        <div className="flex items-center gap-4">
          <AccuracyRing accuracy={accuracy} size={88} strokeWidth={7} label="" />
          <p className="text-sandstone/50 text-xs font-body flex-1">
            {accuracy >= 85 ? t('almostThere') : accuracy >= 50 ? 'Keep refining your alignment.' : 'Move into frame and find your form.'}
          </p>
        </div>
      </div>

      {/* Real-time checklist */}
      <div>
        <p className="text-xs font-body text-sandstone/40 uppercase tracking-widest mb-3">
          {t('realTimeFeedback')}
        </p>
        {!hasChecks && (
          <p className="text-sandstone/40 text-xs font-body italic">Enable your camera to see live checks here.</p>
        )}
        <ul className="space-y-2">
          {checkResults?.map((c) => (
            <li key={c.checkId} className="flex items-center justify-between text-sm font-body">
              <span className="text-sandstone/70">{labelFor(c.checkId)}</span>
              <StatusTag status={c.status} t={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatusTag({ status, t }) {
  if (status === 'ok') {
    return <span className="text-sage text-xs font-body flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5" />{t('good')}</span>
  }
  if (status === 'off') {
    return <span className="text-turmeric text-xs font-body flex items-center gap-1"><WarnIcon className="w-3.5 h-3.5" />{t('adjust')}</span>
  }
  return <span className="text-sandstone/30 text-xs font-body">{t('workOnIt')}</span>
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
function WarnIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4M12 17h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  )
}
