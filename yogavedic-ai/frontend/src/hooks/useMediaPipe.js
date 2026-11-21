import { useEffect, useRef, useState, useCallback } from 'react'
import { evaluateChecks, computeAccuracy, smoothAccuracy, pickPrimaryFeedback } from '../services/poseAnalysis.js'

export function useMediaPipe({ videoRef, canvasRef, activePose, onFeedback, onAccuracy, enabled }) {
  const poseRef = useRef(null)
  const cameraRef = useRef(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(null)
  const accuracyHistRef = useRef([])
  const frameCountRef = useRef(0)

  const drawLandmarks = useCallback((canvas, results) => {
    if (!canvas || !results.poseLandmarks) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    const connections = window.POSE_CONNECTIONS || []
    if (window.drawConnectors) {
      window.drawConnectors(ctx, results.poseLandmarks, connections, { color: '#E8A33D44', lineWidth: 2 })
    }

    // Draw landmarks
    results.poseLandmarks.forEach((lm, i) => {
      const x = lm.x * canvas.width
      const y = lm.y * canvas.height
      const vis = lm.visibility || 0
      if (vis < 0.4) return
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      // Highlight key joints
      const keyJoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]
      ctx.fillStyle = keyJoints.includes(i) ? '#E8A33D' : '#7C9C7A88'
      ctx.fill()
    })
  }, [])

  const onResults = useCallback((results) => {
    if (!canvasRef.current) return
    drawLandmarks(canvasRef.current, results)

    if (!activePose || !activePose.checks || activePose.checks.length === 0) return

    frameCountRef.current++
    // Evaluate every 4 frames to reduce CPU load
    if (frameCountRef.current % 4 !== 0) return

    const checkResults = evaluateChecks(activePose.checks, results.poseLandmarks)
    const raw = computeAccuracy(checkResults)
    const { smoothed, history } = smoothAccuracy(accuracyHistRef.current, raw)
    accuracyHistRef.current = history

    const feedback = pickPrimaryFeedback(checkResults)
    onFeedback && onFeedback(feedback, checkResults)
    onAccuracy && onAccuracy(smoothed)
  }, [activePose, canvasRef, drawLandmarks, onFeedback, onAccuracy])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    async function init() {
      try {
        // MediaPipe Pose is loaded via CDN script tags in index.html (see README).
        // The global `Pose` constructor is available once the CDN scripts load.
        if (!window.Pose) {
          setModelError('MediaPipe not loaded. Check your internet connection.')
          return
        }

        const pose = new window.Pose({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`
        })

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.55
        })

        pose.onResults(onResults)
        if (!cancelled) {
          poseRef.current = pose
          setModelLoaded(true)
        }
      } catch (err) {
        if (!cancelled) setModelError(err.message)
      }
    }

    init()
    return () => { cancelled = true }
  }, [enabled, onResults])

  // Start/stop camera
  useEffect(() => {
    if (!modelLoaded || !enabled || !videoRef.current) return

    let cam
    async function startCamera() {
      if (!window.Camera) return
      cam = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (poseRef.current && videoRef.current) {
            await poseRef.current.send({ image: videoRef.current })
          }
        },
        width: 640,
        height: 480
      })
      await cam.start()
      cameraRef.current = cam
    }

    startCamera()

    return () => {
      cameraRef.current?.stop()
      cameraRef.current = null
    }
  }, [modelLoaded, enabled, videoRef])

  return { modelLoaded, modelError }
}
