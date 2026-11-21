// Pose Analysis — YogaVedic
// Converts raw MediaPipe BlazePose landmark arrays into actionable feedback.
// All geometry is 2-D (x, y normalised 0-1 relative to frame) which is sufficient
// for frontal-plane checks on a single webcam.

export const LM = {
  left_shoulder: 11, right_shoulder: 12,
  left_elbow: 13, right_elbow: 14,
  left_wrist: 15, right_wrist: 16,
  left_hip: 23, right_hip: 24,
  left_knee: 25, right_knee: 26,
  left_ankle: 27, right_ankle: 28
}

// Returns {x, y, visibility} for a named landmark from results.poseLandmarks
export function getLandmark(landmarks, name) {
  const idx = LM[name]
  if (idx === undefined || !landmarks) return null
  return landmarks[idx]
}

// Degrees between vectors BA and BC
export function angleBetween(A, B, C) {
  if (!A || !B || !C) return null
  const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x)
  let deg = Math.abs(radians * 180 / Math.PI)
  if (deg > 180) deg = 360 - deg
  return Math.round(deg)
}

// Angle of the line from A→B relative to vertical (0° = perfectly vertical)
export function verticalAngle(A, B) {
  if (!A || !B) return null
  const dx = B.x - A.x
  const dy = B.y - A.y
  return Math.round(Math.abs(Math.atan2(dx, dy) * 180 / Math.PI))
}

// Level check — returns absolute normalised y-difference between two points
export function levelDiff(A, B) {
  if (!A || !B) return null
  return Math.abs(A.y - B.y)
}

// Run all biomechanical checks for a pose definition against live landmarks.
// Returns an array of { checkId, status: 'ok'|'off'|'missing', message }
export function evaluateChecks(checks, landmarks) {
  if (!landmarks || landmarks.length === 0) return []
  return checks.map(check => {
    const pts = check.points.map(name => getLandmark(landmarks, name))
    const visible = pts.every(p => p && p.visibility > 0.5)
    if (!visible) return { checkId: check.id, status: 'missing', message: 'Move into frame to get feedback.' }

    if (check.type === 'angle') {
      const [A, B, C] = pts
      const deg = angleBetween(A, B, C)
      if (deg === null) return { checkId: check.id, status: 'missing', message: 'Landmark unclear.' }
      const ok = Math.abs(deg - check.targetDeg) <= check.toleranceDeg
      return { checkId: check.id, status: ok ? 'ok' : 'off', message: check.feedback[ok ? 'ok' : 'off'], deg }
    }

    if (check.type === 'vertical_alignment') {
      // For 3 points: chain-check both segments
      const angles = []
      for (let i = 0; i < pts.length - 1; i++) {
        const a = verticalAngle(pts[i], pts[i + 1])
        if (a !== null) angles.push(a)
      }
      const worst = Math.max(...angles)
      const ok = worst <= check.toleranceDeg
      return { checkId: check.id, status: ok ? 'ok' : 'off', message: check.feedback[ok ? 'ok' : 'off'], deg: worst }
    }

    if (check.type === 'level') {
      const [A, B] = pts
      const diff = levelDiff(A, B)
      const ok = diff <= check.toleranceNorm
      return { checkId: check.id, status: ok ? 'ok' : 'off', message: check.feedback[ok ? 'ok' : 'off'] }
    }

    return { checkId: check.id, status: 'missing', message: 'Unknown check type.' }
  })
}

// Compute an overall accuracy score (0-100) from check results
export function computeAccuracy(results) {
  if (!results || results.length === 0) return 0
  const countable = results.filter(r => r.status !== 'missing')
  if (countable.length === 0) return 0
  const passed = countable.filter(r => r.status === 'ok').length
  return Math.round((passed / countable.length) * 100)
}

// Smoothing helper: rolling average of last N accuracy readings
export function smoothAccuracy(history, newVal, windowSize = 8) {
  const next = [...history, newVal].slice(-windowSize)
  const avg = Math.round(next.reduce((s, v) => s + v, 0) / next.length)
  return { smoothed: avg, history: next }
}

// Choose the single most important feedback message to speak/show right now.
// Priority: first 'off' result → else first 'ok' message as positive reinforcement.
export function pickPrimaryFeedback(results) {
  if (!results || results.length === 0) return null
  const firstOff = results.find(r => r.status === 'off')
  if (firstOff) return { type: 'correction', message: firstOff.message }
  const firstOk = results.find(r => r.status === 'ok')
  if (firstOk) return { type: 'praise', message: firstOk.message }
  return { type: 'neutral', message: 'Hold your position and breathe steadily.' }
}
