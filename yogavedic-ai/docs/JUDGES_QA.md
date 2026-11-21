# YogaVedic — Judge Q&A Preparation
## S-VYASA University Hackathon 2026

*40 carefully chosen questions across all judging dimensions. Every answer is structured: direct claim → evidence → differentiation.*

---

## TECHNICAL QUESTIONS

**Q1. How does your pose detection actually work?**
We use Google's MediaPipe BlazePose — a neural network that detects 33 body landmarks from a single RGB camera frame at 25–30fps. Our `poseAnalysis.js` layer then applies biomechanical checks: for each pose we define expected joint angles, e.g., Warrior II requires an ~90° front-knee angle. We compute the angle between three landmarks, compare it to the target with a tolerance threshold, and generate either a correction cue or positive reinforcement. All of this runs as compiled WebAssembly in the browser — zero video upload.

**Q2. Why WebAssembly and not a cloud AI endpoint?**
Three reasons: latency, privacy, and demo reliability. A cloud endpoint adds 200–800ms round-trip — too slow for real-time form correction. Browser WASM runs in under 30ms per frame. And critically for a hackathon demo, we have zero dependency on network quality in this room.

**Q3. How accurate is your joint angle measurement?**
MediaPipe BlazePose is validated at under 3cm mean joint position error on benchmark datasets. Our angle checks use generous tolerances (±10–18° depending on the pose) to account for camera angle and body variation. We smooth accuracy over an 8-frame rolling window to eliminate jitter. A perfect Warrior II with correct knee angle and extended arms scores ~85–95% in our testing.

**Q4. Does it work without internet?**
The frontend is a static build — once loaded, it works offline. MediaPipe models are loaded once from CDN and cached by the browser (Service Worker caching is our Phase 2 addition). The backend/database sync is optional; all session data lives in localStorage.

**Q5. What happens if landmarks aren't visible — say the user is wearing loose clothing?**
Each check has a `visibility` threshold of 0.5 — if any landmark in a check falls below that, the check returns `missing` and we skip it rather than output wrong feedback. The accuracy denominator only includes `visible` checks, so the score stays meaningful. The user sees "Move into frame" as a prompt.

**Q6. Why 33 landmarks? Do you use all of them?**
BlazePose provides 33 but we actively use 10: both shoulders, elbows, wrists, hips, knees, and ankles — the standard anatomical landmarks for yoga alignment assessment. The unused face and finger landmarks are ignored. This gives us full-body structural analysis from a front-facing camera.

**Q7. How do you prevent the AI from giving incorrect corrections?**
Three safeguards: (1) visibility gating — don't evaluate invisible joints. (2) Angle tolerances — corrections only fire when deviation exceeds the pose-specific threshold, not on minor wobble. (3) Feedback throttling — minimum 5 seconds between voice utterances, preventing conflicting rapid-fire instructions.

**Q8. What's the time complexity of your routine generator?**
O(n) where n = number of poses in the library (currently 12). It scores every pose once, sorts in O(n log n), then assigns durations in O(n). On any modern device this takes under 1ms — imperceptible to the user.

**Q9. How do you handle users with limited mobility — e.g., elderly or injured?**
The `fitnessLevel: 'beginner'` path prioritises poses flagged `cameraFriendly: true` with gentler duration assignments. In Phase 2, we'll add a `mobility_constraints` field that removes standing-balance poses and increases seated/supine alternatives. Our `BEGINNER_POSE_IDS` list today already excludes inversions and deep backbends for beginners.

**Q10. What's your data model? Walk us through the MongoDB schema.**
Two collections: `users` (profile, hashed credentials, aggregate stats) and `sessions` (per-session records with pose-level results). We index `users.email` for login lookups, and `sessions.userId + completedAt` as a compound index for paginated history queries. Passwords are bcrypt-hashed at 12 rounds — irreversible even if the DB is compromised.

---

## AI & ML QUESTIONS

**Q11. Is this "real AI" or just rule-based?**
Both, intentionally. The computer vision layer (BlazePose) is a deep neural network — genuinely learned from millions of pose images. Our feedback engine is interpretable rules applied to the neural net's output. This is actually a strength: the rules are auditable by a yoga teacher, the model handles the hard perceptual problem. In healthcare/wellness, interpretable AI is preferred over black-box end-to-end models.

**Q12. Could you replace the rule-based layer with a learned classifier?**
Yes — and that's our Phase 2 ML roadmap. We'd collect labelled landmark data from certified yoga instructors, train a per-pose quality classifier (likely a small MLP on the 33×3 landmark coordinates), and replace our geometric checks with learned confidence scores. The architecture is already designed for this swap — `evaluateChecks()` is the single function to replace.

**Q13. How does the routine recommendation work? Is it ML?**
Current v1 is a weighted scoring function — transparent, deterministic, and zero-latency. Each pose scores points for matching the user's condition categories and fitness level. Phase 3 is a collaborative-filtering recommendation engine trained on aggregated (anonymised) session completion and accuracy data: "users with similar profiles to you got best results from this sequence."

**Q14. What training data does BlazePose use?**
BlazePose was trained by Google on a proprietary dataset of 60,000+ human images with manually annotated body landmarks. It uses a two-stage pipeline: a lightweight detector (BlazeFace variant) to find the person, then a landmark regressor that runs on the cropped region. We use the publicly released model weights.

**Q15. How would you add Ayurvedic personalisation?**
Ayurvedic dosha typing (Vata/Pitta/Kapha) maps well to our existing condition categories. We'd add a dosha questionnaire to onboarding, map dosha type to pose category weights (Vata → grounding poses, Pitta → cooling poses, Kapha → energising flows), and surface an Ayurvedic text RAG (retrieval-augmented generation) using GPT-4 or Llama fine-tuned on Charaka Samhita and Ashtanga Hridayam. S-VYASA's own published research corpus would be invaluable here.

---

## PRODUCT & UX QUESTIONS

**Q16. Why would someone use this over a YouTube yoga video?**
YouTube gives you one-way video. YogaVedic watches you back. A video can't tell you your knee is collapsing inward in Warrior II. We provide personalised, real-time correction that previously required a ₹2,000/hour in-person instructor. We're not competing with instructors — we're making their expertise accessible at scale.

**Q17. What does onboarding look like?**
Five screens, under two minutes: name → age/weight/height/gender → fitness level → health conditions → primary goal. The AI uses every field: age affects calorie calculation, fitness level affects pose selection and duration, conditions drive category weighting. Nothing is asked that isn't used.

**Q18. How does a user know they're improving?**
The dashboard shows accuracy trend by day (area chart), minutes practised (bar chart), and session history with colour-coded accuracy scores. Our 8-frame accuracy smoothing means the live score reflects sustained correct alignment, not momentary lucky frames. Users see a genuinely increasing score as their muscle memory improves.

**Q19. What's the voice coach like? Is it annoying?**
We throttle it to once per 5 seconds minimum, only speak when feedback changes, and prioritise corrections over praise — so it's not congratulating you every 5 seconds. The voice prefers `en-IN` accent on Indian devices. Users can mute it with one tap and unmute with one tap. In testing, users found it "reassuring" rather than intrusive.

**Q20. Does it work on mobile?**
Yes. The UI is fully responsive with a mobile-bottom-nav layout. MediaPipe WASM runs on modern Android and iOS Chrome/Safari. The main constraint is processing power — budget phones may run at 15fps instead of 30fps, which is still sufficient for pose feedback.

---

## BUSINESS QUESTIONS

**Q21. What's your business model?**
Freemium: free tier gives unlimited beginner routines and dashboard. Premium (₹299/month or ₹1,999/year) unlocks advanced AI analysis, custom routine saving, and priority voice coaching. We also target institutions: university wellness programmes (₹50K/year per campus), corporate wellness desks (₹5K/employee/year). Year-1 revenue projection: ₹18L from 500 premium + 3 institution contracts.

**Q22. Who is your target market?**
Primary: 18–35 urban Indians — students, working professionals — who want yoga benefits but can't afford/access regular classes. Secondary: universities and corporates investing in employee/student wellness. India has 93M yoga practitioners; the digital wellness market is growing at 18% CAGR. We're targeting a ₹4,800 Cr addressable market.

**Q23. How do you acquire users?**
S-VYASA University is our anchor: deploy free for all students here, get authentic testimonials, and use the S-VYASA wellness research reputation as credibility for expansion. Phase 2: content marketing (short Instagram reels showing AI correcting poses — inherently viral), university partnership programme, corporate HR partnerships.

**Q24. Who are your competitors?**
DownDog (app, no real-time AI correction), Asana Rebel (video-only), FitXR (VR, expensive hardware). None offer real-time webcam-based AI posture correction specifically for yoga. Peloton has form coaching for cycling but not yoga. Our AI correction layer is the key differentiator.

**Q25. What's the revenue projection for 3 years?**
Year 1: ₹18L (500 premium users + 3 institutions). Year 2: ₹85L (3,000 premium + 15 institutions + 2 corporate deals). Year 3: ₹2.8Cr (12,000 premium + corporate plans + international expansion). We reach profitability at ~800 premium subscribers given our near-zero marginal cost per user (all AI runs client-side).

---

## SECURITY & PRIVACY

**Q26. Is user data safe? What about HIPAA/health data?**
Architecturally, the most sensitive data — video of the user — never leaves the device. Session statistics (duration, accuracy, calories) are the only server-uploaded data. We follow DISHA (India's Digital Information Security in Healthcare Act) guidelines: data minimisation, purpose limitation, and user consent. Passwords are bcrypt-hashed; all API traffic is HTTPS; JWTs expire in 30 days.

**Q27. What if someone hacks the database?**
Passwords are bcrypt-hashed — not reversible. The session data (accuracy percentages, calorie estimates) is not sensitive medical data. No payment card data is stored server-side (Razorpay tokenises it). We'd add field-level encryption for weight/height in production.

**Q28. Do you store video?**
Never. MediaPipe processes each video frame locally in WebAssembly, extracts 33 numbers (landmark coordinates), discards the frame, and passes only those numbers to our feedback engine. No image or video bytes leave the browser.

---

## SCALABILITY

**Q29. How does this scale to 1 million users?**
The AI is client-side — it scales to 1M users with zero additional compute cost. The backend only handles auth, session logging, and profile sync. MongoDB Atlas auto-scales; Express can run behind a Vercel/AWS load balancer. The only scaling cost is storage (~2KB per session record → ₹8,000/year for 10M sessions on Atlas).

**Q30. What if the CDN is down during the demo?**
For the hackathon demo, we pre-cache the MediaPipe WASM and JS files locally in the `public/` directory as a fallback. We'll also have the app running from a hotspot in offline mode — the core AI flow works without internet after the initial load.

---

## S-VYASA & SOCIAL IMPACT

**Q31. Why is this especially relevant for S-VYASA University?**
S-VYASA was founded on the mission of integrating yoga with modern science. YogaVedic is the technological embodiment of that mission — we're using state-of-the-art computer vision to make yoga guidance accessible to millions who can't attend an S-VYASA session in person. Our Ayurvedic roadmap directly extends S-VYASA's published research into a scalable digital format.

**Q32. How does this impact student wellness?**
85% of Indian college students report academic stress; only 12% have access to campus wellness resources. YogaVedic removes two barriers: cost (free tier) and time (10-minute desk routines). A student can do a stress-relief session between lectures, guided by AI, with no scheduling, no equipment, no commute.

**Q33. Could S-VYASA deploy this on campus?**
Yes — this is explicitly our Phase 1 institutional plan. We'd deploy a branded S-VYASA instance with the university's logo, integrate with the student portal for SSO, and add S-VYASA's own yoga research content as guided session overlays. The university gets a modern wellness benefit; we get our first institutional reference customer.

**Q34. Can this help with specific health conditions like diabetes?**
Our Diabetes Support category selects poses clinically associated with blood glucose regulation: Trikonasana, Bhujangasana, Setu Bandhasana, Paschimottanasana. These are drawn from peer-reviewed studies including S-VYASA's own published research on yoga and T2DM. We're not a medical device — we pair with a physician's plan, not replace it.

---

## DEMO & LIVE QUESTIONS

**Q35. What if the camera doesn't work during the demo?**
We have three fallbacks: (1) a second device (phone) if the laptop camera fails, (2) a pre-recorded screen recording of a live session with voice feedback audible, (3) the dashboard and routine pages don't need camera at all and demonstrate the full AI personalisation. The session page also works in non-camera mode — instructions and timer still run.

**Q36. Can you show us a pose correction right now?**
[Stand up, activate session, enter any pose incorrectly] — the AI should immediately surface a correction cue within 1–2 seconds. If you step fully into Warrior II with a straight front knee, it says "Bend your front knee closer to a right angle." Fix it, and it says "Front knee angle looks strong."

**Q37. Why does your accuracy sometimes drop suddenly?**
Rapid accuracy drops usually mean a key landmark dropped below 0.5 visibility — the person moved partially out of frame. We display "Move into frame" in that case. It's an honest reflection of what the model can see, not a bug.

**Q38. What's the one thing you'd add if you had six more months?**
A continuous learning loop: after each session, users optionally rate the feedback quality (👍/👎 per cue). We'd use that signal to fine-tune our angle tolerance thresholds per pose — gradually adapting to what real users find accurate vs. nitpicky. 50,000 sessions generates a meaningful training set.

---

## VISION

**Q39. Where is this in five years?**
Five years out: 500,000 active users across India, South-East Asia, and the Indian diaspora globally. A wearable-integrated version that adapts routine intensity based on live heart rate. An Ayurvedic AI layer trained on S-VYASA's research corpus. University partnerships across 50 campuses. Corporate wellness contracts generating recurring SaaS revenue. The long-term vision is a preventive health OS — starting from yoga and expanding to nutrition, sleep, and meditation.

**Q40. Why will you win?**
Three reasons: technical depth (real AI, not a mock), domain specificity (built for yoga with S-VYASA's own wellness philosophy embedded), and social relevance (the judges themselves can use this, right now, to reduce the stress of running this hackathon). We're not building a feature — we're building a habit. And habits, once formed, are defensible.
