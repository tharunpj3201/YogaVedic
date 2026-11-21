import { useState, useEffect, useRef, useCallback } from 'react'
import { saveSession } from '../services/storageService.js'
import { api } from '../services/apiClient.js'
import {
  speakPoseIntro, speakCountdown, speakSessionComplete,
  startContinuousCoaching, stopContinuousCoaching
} from '../services/voiceCoach.js'

export function useSession(routine, { phrase } = {}) {
  const [poseIndex, setPoseIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [sessionState, setSessionState] = useState('idle') // idle | active | paused | complete
  const [currentAccuracy, setCurrentAccuracy] = useState(0)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [checkResults, setCheckResults] = useState([])
  const [sessionAccuracyLog, setSessionAccuracyLog] = useState([])
  const [poseResults, setPoseResults] = useState([])

  const timerRef = useRef(null)
  const voiceEnabledRef = useRef(true)
  const phraseRef = useRef(phrase)
  const lastFeedbackMsgRef = useRef('')
  phraseRef.current = phrase

  const currentPose = routine?.sequence?.[poseIndex] || null
  const totalPoses = routine?.sequence?.length || 0

  function phraseFn(key, vars) {
    return phraseRef.current ? phraseRef.current(key, vars) : undefined
  }

  // Start the timer for the current pose
  function startPoseTimer(durationSec) {
    clearInterval(timerRef.current)
    setTimeLeft(durationSec)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        if (voiceEnabledRef.current) speakCountdown(prev - 1)
        return prev - 1
      })
    }, 1000)
  }

  // Move to next pose or complete session
  const advancePose = useCallback(() => {
    setPoseResults(prev => [
      ...prev,
      { poseId: currentPose?.id, accuracy: currentAccuracy, durationSec: currentPose?.assignedDurationSec }
    ])

    const nextIndex = poseIndex + 1
    if (nextIndex >= totalPoses) {
      setSessionState('complete')
      clearInterval(timerRef.current)
      stopContinuousCoaching()
    } else {
      setPoseIndex(nextIndex)
      const nextPose = routine.sequence[nextIndex]
      if (voiceEnabledRef.current) speakPoseIntro(nextPose.name, nextPose.phase, phraseFn)
      startPoseTimer(nextPose.assignedDurationSec)
      setCurrentAccuracy(0)
      setCurrentFeedback(null)
      setCheckResults([])
    }
  }, [poseIndex, totalPoses, currentPose, currentAccuracy, routine])

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && sessionState === 'active') {
      advancePose()
    }
  }, [timeLeft, sessionState, advancePose])

  // Continuous coaching loop — runs only while a pose is actively being held.
  // Started here (rather than per-pose) so it survives across pose changes
  // without being torn down and rebuilt each time advancePose runs.
  useEffect(() => {
    if (sessionState !== 'active' || !voiceEnabledRef.current) {
      stopContinuousCoaching()
      return
    }
    startContinuousCoaching({
      phraseFn,
      getMessage: () => lastFeedbackMsgRef.current
        ? null // let a recent real correction/praise take priority this tick
        : phraseFn('breatheReminder')
    })
    return () => stopContinuousCoaching()
  }, [sessionState])

  // Save session when complete
  useEffect(() => {
    if (sessionState !== 'complete' || !routine) return
    const avgAccuracy = sessionAccuracyLog.length > 0
      ? Math.round(sessionAccuracyLog.reduce((s, v) => s + v, 0) / sessionAccuracyLog.length)
      : currentAccuracy
    const session = {
      date: new Date().toISOString(),
      routineTitle: routine.title,
      durationMin: routine.durationMin,
      accuracy: avgAccuracy,
      calories: routine.estimatedCalories,
      posesCompleted: totalPoses,
      poseResults
    }
    saveSession(session)
    // Persist to the account too — fire-and-forget so a slow/offline network
    // never blocks the completion screen. Local cache above is already the
    // source of truth for the dashboard's instant paint.
    api.logSession(session).catch(() => { /* stays in local cache; will simply not sync this one */ })
    if (voiceEnabledRef.current) speakSessionComplete({ accuracy: avgAccuracy, calories: routine.estimatedCalories }, phraseFn)
    // Intentionally fires once on the idle->complete transition only; the
    // other values are read at that instant via closure, not tracked as
    // triggers for re-running this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState])

  function startSession() {
    if (!routine || !routine.sequence?.length) return
    setPoseIndex(0)
    setSessionState('active')
    setCurrentAccuracy(0)
    setCurrentFeedback(null)
    setCheckResults([])
    setPoseResults([])
    setSessionAccuracyLog([])
    const firstPose = routine.sequence[0]
    if (voiceEnabledRef.current) speakPoseIntro(firstPose.name, firstPose.phase, phraseFn)
    startPoseTimer(firstPose.assignedDurationSec)
  }

  function pauseSession() {
    clearInterval(timerRef.current)
    stopContinuousCoaching()
    setSessionState('paused')
  }

  function resumeSession() {
    setSessionState('active')
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  function skipPose() {
    clearInterval(timerRef.current)
    setTimeLeft(0)
    advancePose()
  }

  function handleAccuracy(acc) {
    setCurrentAccuracy(acc)
    setSessionAccuracyLog(prev => [...prev, acc])
  }

  function handleFeedback(fb, results) {
    setCurrentFeedback(fb)
    lastFeedbackMsgRef.current = fb?.message || ''
    if (results) setCheckResults(results)
    // Clear the "recent feedback" guard after a beat so the continuous loop
    // can resume its own gentle cue once real-time correction settles down.
    if (fb?.message) {
      clearTimeout(handleFeedback._t)
      handleFeedback._t = setTimeout(() => { lastFeedbackMsgRef.current = '' }, 6000)
    }
  }

  function setVoiceEnabled(val) {
    voiceEnabledRef.current = val
    if (!val) stopContinuousCoaching()
    else if (sessionState === 'active') {
      startContinuousCoaching({
        phraseFn,
        getMessage: () => lastFeedbackMsgRef.current ? null : phraseFn('breatheReminder')
      })
    }
  }

  // Cleanup
  useEffect(() => () => { clearInterval(timerRef.current); stopContinuousCoaching() }, [])

  return {
    sessionState,
    currentPose,
    poseIndex,
    totalPoses,
    timeLeft,
    currentAccuracy,
    currentFeedback,
    checkResults,
    startSession,
    pauseSession,
    resumeSession,
    skipPose,
    handleAccuracy,
    handleFeedback,
    setVoiceEnabled
  }
}
