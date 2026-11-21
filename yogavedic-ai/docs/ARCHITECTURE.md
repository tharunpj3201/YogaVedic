# YogaVedic — System Architecture

## Overview

YogaVedic is a full-stack yoga coaching platform built with a React SPA frontend, Node/Express REST API, and MongoDB. The core pose-detection pipeline runs **entirely in the browser** using MediaPipe BlazePose — no video data ever leaves the device.

---

## Architecture Diagram (ASCII)

```
┌────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                         │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │               React SPA (Vite + Tailwind)           │  │
│  │                                                     │  │
│  │  ┌──────────────┐   ┌────────────────────────────┐ │  │
│  │  │ Webcam Feed  │──▶│  MediaPipe BlazePose WASM  │ │  │
│  │  └──────────────┘   │  (33 landmarks @ 30fps)    │ │  │
│  │                     └────────────┬───────────────┘ │  │
│  │                                  │ landmark array   │  │
│  │                     ┌────────────▼───────────────┐ │  │
│  │                     │   poseAnalysis.js           │ │  │
│  │                     │   - angleBetween()          │ │  │
│  │                     │   - evaluateChecks()        │ │  │
│  │                     │   - computeAccuracy()       │ │  │
│  │                     └────────────┬───────────────┘ │  │
│  │                                  │ feedback obj     │  │
│  │  ┌──────────────┐   ┌────────────▼───────────────┐ │  │
│  │  │ voiceCoach   │◀──│      SessionPage.jsx        │ │  │
│  │  │ (Web Speech) │   │    useSession hook          │ │  │
│  │  └──────────────┘   └────────────┬───────────────┘ │  │
│  │                                  │ completed session │  │
│  │                     ┌────────────▼───────────────┐ │  │
│  │                     │   storageService.js         │ │  │
│  │                     │   localStorage (offline)    │ │  │
│  │                     └────────────┬───────────────┘ │  │
│  └──────────────────────────────────┼──────────────────┘  │
└─────────────────────────────────────┼──────────────────────┘
                                      │ optional sync (when online)
                          ┌───────────▼────────────┐
                          │  Node/Express REST API  │
                          │  (port 4000)            │
                          │                         │
                          │  POST /api/sessions     │
                          │  GET  /api/sessions     │
                          │  POST /api/auth/login   │
                          └───────────┬─────────────┘
                                      │
                          ┌───────────▼─────────────┐
                          │  MongoDB Atlas           │
                          │  Collections:            │
                          │  · users                 │
                          │  · sessions              │
                          └──────────────────────────┘
```

---

## Pose Detection and Feedback Pipeline

### 1. Landmark Extraction (MediaPipe BlazePose)
- Model: BlazePose Full (complexity=1, balanced speed/accuracy)
- Output: 33 3D landmarks, each with `{x, y, z, visibility}`
- Frame rate: varies with device and browser (not benchmarked in this repository)
- Model: Google's pre-trained MediaPipe model, used as-is (no custom training in this project)
- Processing: WASM + WebGL, runs entirely client-side

### 2. Biomechanical Check Engine (`poseAnalysis.js`)
Each pose in the library defines a set of typed checks:
- **`angle`** — computes the angle at joint B between rays BA and BC
- **`vertical_alignment`** — measures deviation from vertical across a chain of joints
- **`level`** — checks whether two landmarks are at the same height

Each check returns `{ status: 'ok' | 'off' | 'missing', message, deg? }`.

The checks are hand-written rules, not a trained classifier. Currently 5 of the 12 poses define live checks (Mountain, Tree, Warrior II, Triangle, Easy Seated); the other 7 show instructions only.

### 3. Accuracy Score
```
accuracy = (passed_checks / visible_checks) × 100
```
Smoothed over a rolling 8-frame window to prevent flickering.

### 4. Voice Feedback (`voiceCoach.js`)
- Web Speech API (SpeechSynthesisUtterance)
- Throttled: minimum 5 seconds between utterances
- Priority system: corrections pre-empt praise
- Prefers `en-IN` voice if available

### 5. Routine Generation (`routineGenerator.js`)
Pure JS personalization — no ML model required:
1. Map user conditions/goals → target pose categories
2. Score all 12 poses: +3 per matching category, +2 if beginner-safe, +1 if camera-friendly
3. Assign warmup (15%), core (65%), cooldown (20%) time budget
4. Return structured sequence with per-pose durations

---

## Database Schema

### `users` collection
```js
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String (bcrypt, 12 rounds),
  profile: {
    age: Number, gender: String, weight: Number, height: Number,
    fitnessLevel: 'beginner'|'intermediate'|'advanced',
    conditions: [String], goal: String
  },
  stats: {
    totalSessions: Number, totalMinutes: Number,
    totalCalories: Number, avgAccuracy: Number,
    streak: Number, lastSessionDate: Date
  },
  role: 'user'|'admin',
  createdAt: Date, updatedAt: Date
}
```

### `sessions` collection
```js
{
  _id: ObjectId,
  userId: ObjectId (ref: users, indexed),
  routineTitle: String,
  durationMin: Number,
  accuracy: Number,
  calories: Number,
  posesCompleted: Number,
  poseResults: [{ poseId, poseName, accuracy, durationSec }],
  targetCategories: [String],
  fitnessLevel: String,
  completedAt: Date (indexed)
}
```

---

## Security Architecture

| Layer | Control |
|---|---|
| Passwords | bcrypt, 12 rounds |
| Auth | JWT, 30-day expiry, Bearer header |
| Video data | Never leaves browser — zero server-side video |
| HTTPS | Enforced via Vercel / nginx TLS |
| CORS | Restricted to frontend origin |
| Input | Express JSON parser + Mongoose schema validation |
| Rate limiting | Phase 2: express-rate-limit middleware |

---

## Future Architecture (Phase 2+) - PLANNED IDEAS, NOT IMPLEMENTED

```
Phase 2: Cloud Sync
  - Firebase Auth (social login)
  - Firestore for routine favourites
  - Cloud Functions for weekly AI summary emails

Phase 3: Wearable Integration
  - Web Bluetooth API → Garmin / MI Band heart rate
  - Heart rate fed into difficulty adaptation engine

Phase 4: Ayurvedic AI
  - Fine-tuned LLM on Ayurvedic texts
  - Dosha assessment → personalised herb/diet recommendations

Phase 5: FinTech
  - Razorpay subscription integration
  - Institution plans (universities, corporate)
  - Blockchain wellness certificates (Polygon)
```
