import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../App.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { loadCurrentRoutine } from '../services/storageService.js'
import { useMediaPipe } from '../hooks/useMediaPipe.js'
import { useSession } from '../hooks/useSession.js'
import { useVoiceCommands } from '../hooks/useVoiceCommands.js'
import { speakFeedback, setVoiceLanguage } from '../services/voiceCoach.js'
import { localizeCheckResults, pickPrimaryFeedbackLocalized } from '../services/languageService.js'
import AccuracyRing from '../components/AccuracyRing.jsx'
import PoseReference from '../components/PoseReference.jsx'
import PoseReadiness from '../components/PoseReadiness.jsx'
import VoiceCoachPanel from '../components/VoiceCoachPanel.jsx'

export default function SessionPage() {
  const { currentRoutine: ctxRoutine, settings } = useApp()
  const { t, phrase, speechLang, langCode } = useLanguage()
  const navigate = useNavigate()
  const routine = ctxRoutine || loadCurrentRoutine()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [voiceOn, setVoiceOn] = useState(settings?.voiceEnabled !== false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [feedbackType, setFeedbackType] = useState('neutral')
  const lastFeedbackRef = useRef(0)

  const {
    sessionState, currentPose, poseIndex, totalPoses, timeLeft,
    currentAccuracy, checkResults, startSession, pauseSession, resumeSession, skipPose,
    handleAccuracy, handleFeedback, setVoiceEnabled
  } = useSession(routine, { phrase })

  const [voiceCommandsOn, setVoiceCommandsOn] = useState(false)

  function handleVoiceCommand(command) {
    if (command === 'next' && sessionState === 'active') skipPose()
    else if (command === 'pause' && sessionState === 'active') pauseSession()
    else if (command === 'resume' && sessionState === 'paused') resumeSession()
    else if (command === 'repeat' && feedbackMsg && voiceOn) speakFeedback({ type: feedbackType, message: feedbackMsg })
    else if (command === 'exit') navigate('/routine')
  }

  const { listening: voiceCommandsListening, supported: voiceCommandsSupported } = useVoiceCommands({
    enabled: voiceCommandsOn && (sessionState === 'active' || sessionState === 'paused'),
    onCommand: handleVoiceCommand,
    lang: speechLang,
    langCode
  })

  // Keep the voice coach's TTS voice in sync with the chosen UI language.
  useEffect(() => {
    setVoiceLanguage(speechLang)
  }, [speechLang])

  const onFeedback = useCallback((fb, rawResults) => {
    // fb/rawResults come from poseAnalysis.js in English — localize before
    // showing or speaking them so the whole loop stays in the chosen language.
    const localizedResults = localizeCheckResults(rawResults, langCode)
    const localizedFb = pickPrimaryFeedbackLocalized(localizedResults)

    handleFeedback(localizedFb, localizedResults)

    const now = Date.now()
    if (localizedFb && now - lastFeedbackRef.current > 4000) {
      setFeedbackMsg(localizedFb.message)
      setFeedbackType(localizedFb.type)
      lastFeedbackRef.current = now
      if (voiceOn) speakFeedback(localizedFb)
    }
  }, [handleFeedback, voiceOn, langCode])

  const { modelLoaded, modelError } = useMediaPipe({
    videoRef,
    canvasRef,
    activePose: currentPose,
    onFeedback,
    onAccuracy: handleAccuracy,
    enabled: cameraActive && sessionState === 'active'
  })

  useEffect(() => {
    setVoiceEnabled(voiceOn)
  }, [voiceOn, setVoiceEnabled])

  if (!routine) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-2xl text-sandstone/40 mb-4">No routine selected.</p>
        <button onClick={() => navigate('/routine')}
          className="px-6 py-3 btn-glow text-night-deep font-body font-bold rounded-xl text-sm">
          Choose a Routine
        </button>
      </div>
    )
  }

  const feedbackColor = feedbackType === 'ok' || feedbackType === 'praise' ? 'text-sage' :
                        feedbackType === 'correction' || feedbackType === 'off' ? 'text-terracotta' : 'text-sandstone/60'

  const poseProgress = totalPoses > 0 ? ((poseIndex) / totalPoses) * 100 : 0
  const timerProgress = currentPose ? (timeLeft / currentPose.assignedDurationSec) * 100 : 100

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-sandstone">{routine.title}</h1>
          <p className="text-sandstone/50 text-sm font-body">
            Pose {Math.min(poseIndex + 1, totalPoses)} of {totalPoses}
          </p>
        </div>
        <button onClick={() => navigate('/routine')}
          className="text-sandstone/40 text-xs font-body hover:text-sandstone/70 px-3 py-1.5 rounded-lg border border-night-soft">
          Exit
        </button>
      </div>

      {/* Overall progress */}
      <div className="h-1.5 bg-night-soft rounded-full overflow-hidden">
        <motion.div className="h-full bg-turmeric rounded-full" animate={{ width: `${poseProgress}%` }} transition={{ ease: 'easeOut' }} />
      </div>

      {/* Session Complete */}
      <AnimatePresence>
        {sessionState === 'complete' && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-turmeric/20 via-sage/10 to-transparent border border-turmeric/25 shadow-glow-turmeric-lg p-8 text-center">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-turmeric/20 blur-3xl pointer-events-none animate-glow-pulse" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-sage/15 blur-3xl pointer-events-none animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
            <p className="relative z-10 text-5xl mb-4">🙏</p>
            <h2 className="relative z-10 font-display text-3xl text-sandstone mb-2">{t('sessionComplete')}</h2>
            <p className="relative z-10 text-sandstone/60 font-body text-sm mb-2">{t('namaste')}</p>
            <div className="relative z-10 flex justify-center gap-8 mt-6 mb-8">
              <div>
                <p className="font-display text-3xl text-turmeric">{currentAccuracy}%</p>
                <p className="text-sandstone/50 text-xs font-body">Accuracy</p>
              </div>
              <div>
                <p className="font-display text-3xl text-sage">{routine.durationMin}</p>
                <p className="text-sandstone/50 text-xs font-body">Minutes</p>
              </div>
              <div>
                <p className="font-display text-3xl text-terracotta">{routine.estimatedCalories}</p>
                <p className="text-sandstone/50 text-xs font-body">Calories</p>
              </div>
            </div>
            <div className="relative z-10 flex gap-3 justify-center">
              <button onClick={() => navigate('/dashboard')}
                className="px-6 py-3 btn-glow text-night-deep font-body font-bold rounded-xl text-sm transition-all">
                View Progress
              </button>
              <button onClick={() => navigate('/routine')}
                className="px-6 py-3 border border-night-soft text-sandstone/70 font-body font-medium rounded-xl text-sm hover:border-turmeric/30 transition-all">
                New Routine
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active / Idle session UI — 3 column: Reference | Camera | Readiness */}
      {sessionState !== 'complete' && (
        <div className="grid md:grid-cols-12 gap-6">
          {/* Reference Pose panel */}
          <div className="md:col-span-3">
            <PoseReference pose={currentPose} />
          </div>

          {/* Camera panel */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-night-soft border border-night-soft/60 shadow-card aspect-video flex items-center justify-center">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted autoPlay />
              <canvas ref={canvasRef}
                width={640} height={480}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

              {!cameraActive && (
                <div className="relative z-10 text-center px-6 py-8">
                  <p className="text-sandstone/50 font-body text-sm mb-4">
                    Pose detection (MediaPipe) runs on your camera feed in the browser. Your video is processed locally and never uploaded.
                  </p>
                  <button onClick={() => setCameraActive(true)}
                    className="px-5 py-2.5 btn-glow text-night-deep font-body font-semibold rounded-xl text-sm hover:bg-turmeric-light transition-all">
                    {t('enableCamera')}
                  </button>
                </div>
              )}

              {cameraActive && !modelLoaded && !modelError && (
                <div className="absolute inset-0 flex items-center justify-center bg-night-deep/60 z-10">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-turmeric border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sandstone/60 text-xs font-body">Loading pose model…</p>
                  </div>
                </div>
              )}

              {modelError && (
                <div className="absolute inset-0 flex items-center justify-center bg-night-deep/80 z-10 p-6">
                  <div className="text-center">
                    <p className="text-terracotta text-sm font-body mb-2">⚠ {modelError}</p>
                    <p className="text-sandstone/40 text-xs font-body">You can still practice — feedback will be text-only.</p>
                  </div>
                </div>
              )}

              {/* Pose name overlay */}
              {sessionState === 'active' && currentPose && (
                <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                  <span className="px-3 py-1.5 bg-night-deep/80 rounded-lg text-sandstone text-xs font-body backdrop-blur-sm">
                    {currentPose.name}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold backdrop-blur-sm bg-night-deep/80
                    ${currentAccuracy >= 75 ? 'text-sage' : currentAccuracy >= 45 ? 'text-turmeric' : 'text-terracotta'}`}>
                    {currentAccuracy}%
                  </span>
                </div>
              )}
            </div>

            {/* Feedback message */}
            <AnimatePresence mode="wait">
              {feedbackMsg && (
                <motion.div key={feedbackMsg}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`px-4 py-3 rounded-xl bg-night border border-night-soft text-sm font-body ${feedbackColor}`}>
                  {feedbackType === 'correction' ? '⚠ ' : '✓ '}{feedbackMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current pose card */}
            {currentPose && (
              <div className="rounded-2xl glass-card hover-lift p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-sandstone/40 font-mono uppercase tracking-widest capitalize mb-1">{currentPose.phase}</p>
                    <h2 className="font-display text-xl text-sandstone">{currentPose.name}</h2>
                    <p className="text-sandstone/40 text-xs font-body italic">{currentPose.sanskrit}</p>
                  </div>
                  <AccuracyRing accuracy={currentAccuracy} size={72} strokeWidth={6} label="" />
                </div>

                {/* Timer bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-sandstone/40 font-mono mb-1.5">
                    <span>Hold</span>
                    <span>{timeLeft}s</span>
                  </div>
                  <div className="h-2 bg-night-soft rounded-full overflow-hidden">
                    <motion.div className="h-full bg-turmeric rounded-full"
                      animate={{ width: `${timerProgress}%` }}
                      transition={{ ease: 'linear', duration: 1 }} />
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="rounded-2xl glass-card hover-lift p-4 space-y-3">
              {sessionState === 'idle' && (
                <button onClick={startSession}
                  className="w-full py-3 btn-glow text-night-deep font-body font-bold rounded-xl text-sm hover:bg-turmeric-light transition-all">
                  {t('startSession')}
                </button>
              )}
              {sessionState === 'active' && (
                <div className="flex gap-2">
                  <button onClick={pauseSession}
                    className="flex-1 py-2.5 border border-night-soft text-sandstone/70 font-body font-medium rounded-xl text-sm hover:border-turmeric/30 transition-all">
                    {t('pause')}
                  </button>
                  <button onClick={skipPose}
                    className="flex-1 py-2.5 border border-night-soft text-sandstone/70 font-body font-medium rounded-xl text-sm hover:border-turmeric/30 transition-all">
                    {t('skipPose')}
                  </button>
                </div>
              )}
              {sessionState === 'paused' && (
                <button onClick={resumeSession}
                  className="w-full py-3 bg-sage text-night-deep font-body font-bold rounded-xl text-sm hover:bg-sage-light transition-all">
                  {t('resume')}
                </button>
              )}
            </div>
          </div>

          {/* Right panel — Readiness + Voice Coach + Sequence */}
          <div className="md:col-span-3 space-y-4">
            <PoseReadiness checkResults={checkResults} accuracy={currentAccuracy} />

            <VoiceCoachPanel
              message={feedbackMsg}
              voiceOn={voiceOn}
              onToggle={() => setVoiceOn(v => !v)}
            />

            {/* Voice commands — hands-free session control via NLP */}
            {voiceCommandsSupported && (
              <div className="rounded-2xl glass-card hover-lift p-4">
                <button onClick={() => setVoiceCommandsOn(v => !v)}
                  className="w-full flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-2.5">
                    <span className={`relative w-2.5 h-2.5 rounded-full shrink-0 ${voiceCommandsListening ? 'bg-terracotta' : 'bg-night-soft'}`}>
                      {voiceCommandsListening && <span className="absolute inset-0 rounded-full bg-terracotta animate-ping" />}
                    </span>
                    <span className="text-sm font-body text-sandstone/80 group-hover:text-sandstone transition-colors">Voice Commands</span>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-lg ${voiceCommandsOn ? 'bg-terracotta/15 text-terracotta' : 'bg-night-soft text-sandstone/40'}`}>
                    {voiceCommandsOn ? 'ON' : 'OFF'}
                  </span>
                </button>
                {voiceCommandsOn && (
                  <p className="text-sandstone/30 text-xs font-body mt-2.5 leading-relaxed">
                    Try saying &ldquo;next&rdquo;, &ldquo;pause&rdquo;, &ldquo;resume&rdquo;, &ldquo;repeat&rdquo;, or &ldquo;exit&rdquo;.
                  </p>
                )}
              </div>
            )}

            {/* Sequence list */}
            <div className="rounded-2xl glass-card hover-lift p-4">
              <p className="text-xs font-body text-sandstone/40 uppercase tracking-widest mb-3">{t('upNext')}</p>
              <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin">
                {routine.sequence.map((pose, i) => (
                  <div key={pose.id + i}
                    className={`flex items-center gap-3 py-2 rounded-lg px-2 transition-colors
                      ${i === poseIndex ? 'bg-turmeric/10 border border-turmeric/20' :
                        i < poseIndex ? 'opacity-30' : 'opacity-60'}`}>
                    <span className="text-xs font-mono text-sandstone/40 w-4 shrink-0">{i + 1}</span>
                    <span className="text-sm font-body text-sandstone truncate">{pose.name}</span>
                    <span className="text-xs font-mono text-sandstone/30 shrink-0 ml-auto">{pose.assignedDurationSec}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
