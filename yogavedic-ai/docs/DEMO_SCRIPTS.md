# YogaVedic — Demo Scripts
## Three Lengths + Live Demo Walkthrough

---

## 2-MINUTE PITCH (Elevator / Opening Hook)

**[Stand confidently. No slides needed. Just the running app on a laptop visible to judges.]**

"Raise your hand if you've ever tried yoga from a YouTube video and weren't sure if you were doing it right."
*[Pause for hands or acknowledgment]*

"That uncertainty — that missing feedback — causes 30% of yoga injuries. And hiring a certified instructor costs ₹2,000 per session.

YogaVedic solves this with your phone camera and artificial intelligence. Watch."

*[Turn laptop to face judges. Open /session. Stand in Warrior II — front knee intentionally too straight.]*

"The AI just said — [let voice speak] — 'Bend your front knee closer to a right angle.' That's real-time biomechanical analysis from Google's MediaPipe neural network detecting 33 body landmarks at 30 frames per second. Processed entirely on this laptop. No cloud. No upload. No data leaving this room.

We've built the full product: personalised routine generation based on your health conditions, a voice coach that talks you through each pose, and a progress dashboard tracking your accuracy over time.

YogaVedic — ancient yoga wisdom, powered by AI. Thank you."

---

## 5-MINUTE PITCH (Standard Hackathon Presentation)

**[Laptop open to Landing Page. Slides on projector if available.]**

**[0:00 – 0:30] — Hook**
"93 million Indians practise yoga. Almost none get real guidance. Incorrect form causes injury, certified instructors are expensive, and quality coaching doesn't reach Tier 2 and 3 cities. We built YogaVedic to change that."

**[0:30 – 1:00] — What it is**
"YogaVedic is a browser-based AI yoga coach. Point your camera at yourself, choose a routine, and our AI — powered by Google's MediaPipe BlazePose — watches you in real time, corrects your alignment through voice, and tracks your progress over time. All free. All private. All offline-capable."

**[1:00 – 2:30] — Live Demo**
*[Navigate to /onboarding — show the questionnaire]*
"We start with a 90-second onboarding: age, fitness level, health conditions, goal. The AI uses every single field."

*[Complete onboarding or load pre-filled profile. Navigate to /routine]*
"AI generates a personalised sequence. Here — 15-minute Stress Relief for a beginner with back pain concerns. 10 poses, warmup to cooldown, durations calibrated to my fitness level."

*[Click Start Session. Enable camera.]*
"Camera activates. MediaPipe loads — watch the skeleton appear on my body."

*[Enter Warrior II with front knee too straight. Wait for voice cue.]*
"[Voice: 'Bend your front knee closer to a right angle.'] — that's the AI's biomechanical check on my left hip–knee–ankle angle. Let me fix it — [bend knee] — [Voice: 'Front knee angle looks strong, right around 90°']. Real-time. Live. No API call."

**[2:30 – 3:30] — Dashboard and Tech**
*[Navigate to /dashboard]*
"Post-session, everything is logged. Accuracy over the week, minutes practised, calories, streak. Built with Recharts for the charts, localStorage for offline reliability, MongoDB for cloud sync."

"The tech stack: React 18, TailwindCSS, Framer Motion for animations, MediaPipe BlazePose running as WebAssembly, Node/Express backend, MongoDB, JWT auth, Docker, and deployed on Vercel with GitHub Actions CI/CD."

**[3:30 – 4:30] — Impact + Business**
"Our target: students under exam stress, corporate workers with back pain, diabetes patients, elderly practising safely at home. All groups that can't afford or access regular classes.

Business model: free tier for adoption, ₹299/month premium, ₹50,000/year university contracts. Year-1 revenue projection: ₹18 lakhs. Near-zero marginal cost — the AI runs on the user's device, not ours.

S-VYASA is our launch partner and validation — this university's own yoga research backs every pose in our library."

**[4:30 – 5:00] — Close**
"YogaVedic is live, working, and available right now at [URL]. We're five MCA Semester II students who built every line of this in under 72 hours. Thank you. Questions?"

---

## 10-MINUTE PITCH (Detailed Technical + Business Presentation)

**[Full slides + laptop demo. Alternate between slides and live app.]*

**[0:00 – 1:00] — Problem (Slide 2 + 3)**
Open with the injury statistic. Show the problem tiles. Quote the ₹2,000/class cost. Mention 85% student stress statistic — personal for S-VYASA judges.

**[1:00 – 2:00] — Solution Overview (Slide 4)**
Walk through all four pillars: pose detection, voice coach, routine generator, dashboard. Explain why all four together matter — detection without correction is useless; correction without personalised routines misses the user's actual needs.

**[2:00 – 4:00] — Live Demo (Slide 5 + live)**
Full demo walkthrough:
1. Show onboarding (30s)
2. Show routine generation — explain the scoring algorithm live ("it scores each pose +3 per matching category, +2 if beginner-safe")
3. Show session with camera — get two different corrections and one praise cue
4. Show accuracy ring changing in real time
5. Skip forward in session, show completion screen
6. Show dashboard with demo data — explain the charts

**[4:00 – 5:30] — Technical Deep Dive (Slides 6 + 7)**
Pull up `poseAnalysis.js` source code briefly. Show the `angleBetween()` function — 6 lines of trigonometry. Explain the 33 landmarks diagram. Walk through the `evaluateChecks()` logic. Then pivot to architecture — "the single most important design decision: no video ever leaves the browser."

**[5:30 – 6:30] — AI Architecture (Slide 7)**
Explain MediaPipe BlazePose training: 60,000+ images, two-stage pipeline (detector then landmark regressor). Explain WebAssembly: "this is the same binary format that runs Google Maps offline and Figma in the browser." Explain why this beats a cloud API for our use case.

**[6:30 – 7:30] — Health Impact (Slide 8)**
Walk through each target user group. Mention the specific poses in each category and their clinical evidence base (cite S-VYASA research if possible). Emphasise the equity angle: free tier, Tier 2/3 cities, elderly users.

**[7:30 – 8:30] — Business Model (Slide 9)**
Walk through the tier table. Explain unit economics: why near-zero marginal cost is the key insight. Show the revenue chart. Explain the institutional go-to-market: S-VYASA as launch anchor, then expand to 50 campuses.

**[8:30 – 9:30] — Roadmap + Team (Slides 10 + 11)**
Walk timeline. Emphasise Phase 2 (heart rate wearables) as the technical leap — show how the existing architecture supports it with one new data source. Introduce team members by name, role, and what they built. Thank the guide and dean.

**[9:30 – 10:00] — Close (Slide 12)**
Show QR code. Invite judges to scan and try it. Deliver closing line. 

---

## LIVE DEMO WALKTHROUGH (Safety Checklist)

### Pre-Demo Setup (30 minutes before)
- [ ] Open browser to `http://localhost:5173` or `https://yogavedic.vercel.app`
- [ ] Pre-complete onboarding with demo profile (Shiva, 22, beginner, stress + back pain)
- [ ] Have /session page loaded but camera not yet enabled
- [ ] Check room lighting — face a window or bright light, not away from it
- [ ] Check audio output — voice coach should be audible through laptop speakers
- [ ] Have a backup tab open with a screen recording of a working session
- [ ] Phone charged and connected to a hotspot for internet backup
- [ ] Load MediaPipe CDN scripts by visiting /session once (caches the WASM)

### Demo Flow (During Presentation)
1. **Landing** → Click "Start Your Journey" → 10s for prana ring animation to make impression
2. **Onboarding** → Speed through (profile pre-filled), or skip directly to dashboard
3. **Routine** → Click "15-min Stress Relief" quick start → show sequence preview
4. **Session** → "Enable Camera" → wait for skeleton (5-7 seconds) → enter Warrior II
5. **Pose** → Front knee straight → wait for voice cue → bend knee → wait for praise
6. **Skip** two poses → show session complete screen with accuracy + calories
7. **Dashboard** → Show accuracy chart → show session history
8. **Profile** → Show BMI calculated from height/weight

### If Something Goes Wrong
| Problem | Fallback |
|---|---|
| Camera not working | Say: "Let me use my phone" → open mobile version |
| MediaPipe not loading | Show pre-recorded screen-capture video in another tab |
| Internet down | App works offline after first load — say this is a feature, not a bug |
| Voice not speaking | Mute/unmute toggle → demonstrate text feedback is still shown |
| App crashes | Pre-built `dist/` folder opened directly in browser as file:// |

### Killer Demo Moment
The single most impressive moment: while standing in Warrior II, let the AI give its correction cue out loud in the quiet room. Then visibly fix the pose. The AI's praise response — "Front knee angle looks strong" — spoken aloud to you in front of the judges, is the moment this stops being a slide deck and becomes a product.
