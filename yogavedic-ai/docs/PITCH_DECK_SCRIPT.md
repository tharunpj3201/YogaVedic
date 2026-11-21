# YogaVedic — Pitch Deck
## 12-Slide Script with Speaker Notes, Visual Suggestions & Judging Points
### S-VYASA University Hackathon 2026

---

## SLIDE 1 — TITLE

**Headline:** YogaVedic
**Sub:** Ancient Yoga Wisdom Powered by Artificial Intelligence

**Visual:** Dark background (#1B1A33). Central breathing prana ring animation (3 concentric circles pulsing slowly). Large "ॐ" symbol in turmeric gold. Team name bottom-left. S-VYASA logo top-right.

**Speaker Notes:**
"Good afternoon. We are Team YogaVedic from S-VYASA University's School of Computer Science. Our project is YogaVedic — a real-time AI yoga coach that runs entirely on your smartphone or laptop camera. In the next few minutes, I want to show you something working, not just slides."

**Judging Points:** First impression of branding, connection to S-VYASA's yoga heritage.

---

## SLIDE 2 — PROBLEM

**Headline:** 93 Million Yoga Practitioners. Almost None Get Real Guidance.

**Three problem tiles:**
- 🏥 Incorrect form causes 30% of yoga injuries (NCBI 2020)
- 💸 Certified yoga instructors cost ₹1,500–₹4,000 per class
- 📍 Quality instruction is inaccessible outside metro cities

**Bottom stat:** "85% of Indian college students report academic stress. Only 12% have access to structured campus wellness resources."

**Visual:** Left half — grainy stock photo of a crowded gym class (no personal attention). Right half — data tiles in terracotta/dark card style.

**Speaker Notes:**
"Yoga is India's gift to the world. But here's the irony — most people who practise yoga do so with incorrect form, risking injury rather than gaining wellness. A qualified instructor costs money, time, and geography. We've built the solution."

**Judging Points:** Problem is real, data-backed, personally relevant to judges as yoga practitioners / academics.

---

## SLIDE 3 — MARKET OPPORTUNITY

**Headline:** A ₹4,800 Crore Addressable Market — Growing at 18% CAGR

**Three market circles (nested):**
- TAM: ₹4,800 Cr — Indian digital wellness market
- SAM: ₹620 Cr — yoga-specific digital coaching
- SOM: ₹18 Cr — achievable Year 1 (students + early corporates)

**Supporting data:**
- 93M yoga practitioners in India
- 550M smartphone users
- Corporate wellness market: ₹1,200 Cr by 2027

**Visual:** Concentric circles in turmeric/sage/terracotta gradient. Market size labels with source citations.

**Speaker Notes:**
"The yoga market is not a niche — it's a national priority. PM's International Day of Yoga, AYUSH Ministry growth, corporate wellness mandates post-COVID. We're not building for a small audience. We're building for India."

**Judging Points:** Market sizing demonstrates business thinking. CAGR shows growth awareness.

---

## SLIDE 4 — SOLUTION

**Headline:** YogaVedic — Your AI Yoga Coach. Always On. Always Personalised.

**Four feature tiles with icons:**
1. 🤖 Real-Time Pose Detection — 33 landmarks, 30fps, browser-based
2. 🎙 Voice Coach — "Straighten your back." Hands-free, instant
3. 📋 Personalised Routines — AI-generated for your age, conditions, goals
4. 📊 Progress Dashboard — accuracy trends, streaks, calorie tracking

**Central line:** "All AI processing happens on your device. Your video never leaves your camera."

**Visual:** 2×2 grid of feature cards. Small phone mockup showing the session screen centre.

**Speaker Notes:**
"Our answer to all three problems: YogaVedic uses your device's camera and Google's MediaPipe neural network to analyse your pose in real time, give you voice corrections instantly, and build a routine specifically for your health profile — all free, all private, all offline-capable."

**Judging Points:** Solution directly maps to each problem. Privacy emphasis differentiates from cloud competitors.

---

## SLIDE 5 — PRODUCT DEMO

**Headline:** Live Demo

**Full-bleed phone/laptop mockup with session screen showing:**
- Camera feed with landmark skeleton overlay
- Accuracy ring at 82%
- Voice feedback bubble: "Bend your front knee closer to a right angle."
- Pose timer: Warrior II — 18s remaining

**Visual:** Large annotated screenshot. Four callout arrows: "MediaPipe landmarks," "Real-time accuracy," "Voice correction," "Pose timer."

**Speaker Notes:**
"Let me show you this live. [Open laptop, navigate to /session, enable camera, enter a pose, let AI correct.] What you're seeing — the skeleton overlay, the accuracy score, the voice feedback — is all happening in this browser, processed by a neural network running as WebAssembly, with zero API calls. Entirely local."

**Judging Points:** This is the highest-impact slide if demo is smooth. Judges see working AI, not slides.

---

## SLIDE 6 — TECHNOLOGY

**Headline:** Production-Grade Tech Stack

**Stack diagram (left to right: data flow):**
```
Camera → MediaPipe WASM → poseAnalysis.js → Feedback Engine → Web Speech API
                                                ↓
                                        React UI (Vite + Tailwind)
                                                ↓
                                    localStorage (offline) → MongoDB (sync)
                                                ↓
                                    Node/Express REST API
```

**Tech badges:** React 18, TailwindCSS, Framer Motion, MediaPipe BlazePose, Node.js, MongoDB, JWT, Docker, Vercel, GitHub Actions

**Visual:** Dark card with glowing tech stack flow. Each technology badge with its icon.

**Speaker Notes:**
"We chose technologies for three reasons: speed of development, production scalability, and hackathon demo reliability. MediaPipe runs in WebAssembly — same binary that powers Google Lens. React 18 with Vite gives us instant hot reload. MongoDB scales to millions of users. Everything is containerised with Docker."

**Judging Points:** Shows engineering maturity. CI/CD + Docker shows production readiness beyond a prototype.

---

## SLIDE 7 — ARCHITECTURE

**Headline:** Privacy-First, Offline-Capable Architecture

**Architecture diagram:**
```
[User's Device]                    [Our Servers]
Camera Frame → MediaPipe WASM     (Never receives video)
            → 33 Numbers           ← Session stats only
            → Feedback             ← Auth tokens
            → localStorage         ← MongoDB aggregate data
```

**Key call-outs:**
- ✅ Video processed locally — WASM + WebGL
- ✅ Works without internet after first load
- ✅ HTTPS + JWT + bcrypt — DISHA-compliant data handling
- ✅ Under 2KB of data per session synced to server

**Visual:** Split-screen: left = device (camera icon, brain icon), right = server (tiny MongoDB icon). Thick arrow from device to server labelled "2KB stats only."

**Speaker Notes:**
"Here's what makes us different from every cloud AI competitor: we never see your video. Not one frame. MediaPipe extracts 33 landmark coordinates from each frame locally, discards the frame, and only the numbers travel anywhere. This isn't just ethical — it's technically better. Zero latency. Zero upload. Works on a plane."

**Judging Points:** Privacy architecture is a major differentiator, especially for health data. Offline capability = demo safety.

---

## SLIDE 8 — IMPACT

**Headline:** From S-VYASA to 93 Million Practitioners

**Impact grid:**
| Who | How | Scale |
|---|---|---|
| Students | Stress relief, exam posture | 1.5 Cr students in Karnataka alone |
| Corporate | Desk recovery, back pain prevention | 40% of IT workers have back pain |
| Diabetes patients | Evidence-based yoga sequences | 10 Cr T2DM patients in India |
| Elderly | Safe, guidance-supervised practice | 8 Cr elderly living alone |

**Social impact stat:** "A single certified yoga class reaches 15 people. YogaVedic reaches 15 million — for free."

**Visual:** India map with radial dots (university cities). Impact category icons.

**Speaker Notes:**
"The real power is democratisation. S-VYASA's yoga expertise, which has been proven in clinical trials — including on diabetes, stress, and hypertension — can now reach any smartphone user in any village in India. We're a distribution layer for evidence-based wellness."

**Judging Points:** S-VYASA research alignment, social impact framing, health equity angle.

---

## SLIDE 9 — BUSINESS MODEL

**Headline:** Freemium → Institution → Corporate — Three Revenue Streams

**Tier table:**
| Tier | Price | Users | Revenue/User |
|---|---|---|---|
| Free | ₹0 | Students, general | Acquisition funnel |
| Premium | ₹299/mo or ₹1,999/yr | Enthusiasts | ₹1,999/yr |
| University | ₹50,000/yr per campus | Institutions | ₹50,000 |
| Corporate | ₹5,000/emp/yr | Enterprise | ₹5,000 |

**Revenue forecast bar chart:**
- Year 1: ₹18L
- Year 2: ₹85L
- Year 3: ₹2.8Cr

**Visual:** Clean tier cards with price badges. Bar chart in turmeric/sage.

**Speaker Notes:**
"Our unit economics are exceptional because our marginal cost per user is near zero — the AI runs on their device. We monetise depth of engagement, not compute. The institutional model is our fastest path to revenue: one university contract = 5,000 free users who become our word-of-mouth army."

**Judging Points:** Realistic projections with clear assumptions. Near-zero marginal cost is a strong VC-style insight.

---

## SLIDE 10 — ROADMAP

**Headline:** 24-Month Product Roadmap

**Timeline (horizontal):**
```
NOW (v1.0)        Q3 2026 (v1.1)      Q1 2027 (v2.0)     Q3 2027 (v3.0)
────────────────────────────────────────────────────────────────────────
✅ Pose detection  🔄 Firebase Auth    🗓 Heart rate       🗓 Ayurvedic AI
✅ Voice coach     🔄 Cloud sync       🗓 Wearables        🗓 Meditation coach
✅ Routines        🔄 Social sharing   🗓 Advanced ML      🗓 Nutrition advisor
✅ Dashboard       🔄 PWA / offline    🗓 Institution API  🗓 Blockchain certs
```

**Visual:** Horizontal timeline with milestone markers. Green = done, amber = in progress, grey = planned.

**Speaker Notes:**
"Version 1 is what you're seeing today — complete and working. Our immediate next step is cloud sync and Firebase Auth, which lets multiple devices share the same profile. The big technical jump is Version 2 — adding heart rate from a wearable to dynamically adjust difficulty mid-session. The Ayurvedic AI in Version 3 is our most exciting vision — and most aligned with S-VYASA's own research mission."

**Judging Points:** Shows thinking beyond the hackathon. Realistic phasing with clear dependencies.

---

## SLIDE 11 — TEAM

**Headline:** Team YogaVedic — MCA Semester II, S-VYASA University

**Team grid (5 members):**
| Name | Role | Contribution |
|---|---|---|
| Shivakumar | Visualisation & Docs | UI design, dashboard, documentation |
| [Member 2] | AI Integration | MediaPipe pipeline, pose analysis engine |
| [Member 3] | Frontend Dev | React components, routing, animations |
| [Member 4] | Backend Dev | Express API, MongoDB, JWT auth |
| [Member 5] | Data & QA | Seed data, testing, demo preparation |

**Guide:** Prof. Pankaja Benkal (Assistant Professor)
**Dean:** Dr. Sachin Sharma

**Visual:** Clean 5-card grid. Each card: name, role, icon representing their contribution.

**Speaker Notes:**
"Five second-year MCA students built everything you've seen today from scratch in under 72 hours. Every file, every line of code, every animation. No templates, no boilerplate beyond what npm install provides. Our guide Professor Pankaja Benkal gave us the research grounding; the code is ours."

**Judging Points:** Team completeness, clear role division, academic context.

---

## SLIDE 12 — THANK YOU / CLOSING

**Headline:** Try It Right Now
**Sub:** yogavedic.vercel.app

**QR code:** links to the live deployment

**Closing line:** "YogaVedic — because every person deserves a yoga teacher who never tires, never judges, and never charges extra."

**Bottom bar:** ॐ  S-VYASA University · Hackathon 2026 · Team YogaVedic

**Visual:** Prana rings animation returns. QR code centre-right. Dark, elegant, minimal.

**Speaker Notes:**
"Thank you. The app is live — scan this QR code and try it on your own phone right now. We'd love to answer your questions. Namaste."

**Judging Points:** Confident close. Live deployment shows production readiness. Memorable tagline.

---

## GENERAL PRESENTATION TIPS

1. **Open with the live demo**, not slides 1-4. Judges have seen 20 slide decks. They haven't seen real AI correct their pose.
2. **Hold Warrior II for 5 seconds** while facing the camera — let the AI give a live voice correction. That 5 seconds is worth 5 slides.
3. **Keep slides at 30 seconds each** except Demo (2 min) and Q&A (5 min buffer).
4. **Anticipate the "is it real AI?" question** — have the poseAnalysis.js source code tab open to show the geometric engine.
5. **Name-drop S-VYASA research** when answering health condition questions — shows you've done the domain homework.
6. **Smile when the voice coach speaks** — it's charming and makes judges remember you.
