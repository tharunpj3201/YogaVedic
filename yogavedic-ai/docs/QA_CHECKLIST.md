# YogaVedic — Manual QA + Hackathon Demo Checklist

## PRE-DEMO MANUAL TEST CHECKLIST
### Run through every item at least 2 hours before presenting

---

## LANDING PAGE
- [ ] Prana rings animate on load (3 concentric circles breathing in/out)
- [ ] "ॐ" symbol pulses with breath animation
- [ ] "Breathe in / Breathe out" text toggles every 4 seconds
- [ ] "Start Your Journey" button navigates to /onboarding
- [ ] Feature pills are visible at bottom of page
- [ ] Page is readable on mobile (< 420px viewport)

---

## ONBOARDING
- [ ] Step 1: Name input accepts text, "Continue" requires non-empty name
- [ ] Step 2: All 4 fields (age, weight, height, gender) are fillable
- [ ] Step 3: Fitness level — clicking each option highlights it correctly
- [ ] Step 4: Multi-select conditions — clicking toggles on/off, can select multiple
- [ ] Step 5: Goal textarea accepts free text
- [ ] Progress bar advances on each step
- [ ] "Back" button navigates back correctly
- [ ] "Create My Routine" on last step saves profile and navigates to /dashboard
- [ ] Completed profile persists after page refresh (localStorage check)

---

## DASHBOARD
- [ ] Greeting shows the user's name
- [ ] Streak message shows "Start your first session today" if no sessions
- [ ] 4 stat cards render: Sessions, Minutes, Accuracy, Calories
- [ ] "Choose a Routine" button navigates to /routine
- [ ] With demo data seeded: weekly accuracy area chart renders
- [ ] With demo data seeded: weekly minutes bar chart renders
- [ ] With demo data seeded: recent sessions list shows up to 5 rows
- [ ] Accuracy colour codes correctly: ≥75% sage, ≥50% turmeric, <50% terracotta

---

## ROUTINE PAGE
- [ ] 4 Quick Start cards are visible
- [ ] Clicking a Quick Start card immediately starts a session (navigates to /session)
- [ ] Custom builder: all 4 duration buttons (10/15/20/30 min) are selectable
- [ ] Custom builder: all 7 goal chips are selectable, clicking again deselects
- [ ] "Generate My Routine" button produces a routine preview
- [ ] Routine preview shows title, pose count, duration, calories estimate
- [ ] Pose sequence renders with phase labels (warmup/core/cooldown)
- [ ] Each pose shows name, Sanskrit name, duration in seconds
- [ ] "← Rebuild" returns to builder without clearing the form
- [ ] "Start Session" navigates to /session with routine saved

---

## SESSION PAGE — No Camera
- [ ] Shows routine title and "Pose 0 of N" counter
- [ ] Camera enable button visible and clearly labelled
- [ ] Without camera: "Start Session" button starts timer
- [ ] Timer counts down from pose duration
- [ ] At 0, auto-advances to next pose
- [ ] Pose card updates: name, Sanskrit, phase, instructions
- [ ] "Pause" button stops timer; "Resume" restarts it
- [ ] "Skip Pose" advances immediately
- [ ] Sequence list updates: current pose highlighted, past poses dimmed
- [ ] Voice On/Off toggle changes button label
- [ ] "Exit" navigates back to /routine

---

## SESSION PAGE — With Camera
- [ ] "Enable Camera" triggers browser permission prompt
- [ ] After permission: video feed appears in camera panel
- [ ] MediaPipe skeleton overlay appears on body (may take 5–10 seconds)
- [ ] Gold dots on key joints (shoulders, hips, knees, wrists)
- [ ] Accuracy ring updates in real time (not static at 0)
- [ ] Voice coach speaks pose name when session starts
- [ ] Voice coach speaks feedback (correction or praise) during poses
- [ ] Feedback message panel below camera shows text version of voice cue
- [ ] Muting voice coach stops speech; unmuting restores it
- [ ] Accuracy score in top-right corner of camera panel updates live

---

## SESSION COMPLETE
- [ ] Completion screen shows 🙏 emoji and "Session Complete!"
- [ ] Shows accuracy, minutes, calories
- [ ] Voice coach speaks completion summary
- [ ] "View Progress" navigates to /dashboard
- [ ] "New Routine" navigates to /routine
- [ ] Session appears in dashboard history after completion

---

## PROFILE PAGE
- [ ] Shows user name, avatar initial, fitness level
- [ ] BMI is calculated and displayed if weight + height are set
- [ ] BMI label colour: sage for normal, turmeric for overweight, terracotta for extremes
- [ ] "Edit" mode enables all input fields
- [ ] Saving updates profile and dismisses edit mode
- [ ] "Cancel" discards changes
- [ ] Health conditions shown as chips
- [ ] Primary goal shown in quotes
- [ ] "Clear Session History" shows confirm dialog before clearing

---

## NAVIGATION
- [ ] Desktop sidebar: all 4 nav links work
- [ ] Mobile bottom nav: all 4 nav links work
- [ ] Active nav item has turmeric highlight
- [ ] Direct URL navigation to /dashboard requires completed onboarding (redirects if not)
- [ ] Direct URL navigation to /session works if routine is in localStorage

---

## CROSS-BROWSER CHECKS
- [ ] Chrome (primary — best MediaPipe support)
- [ ] Firefox (MediaPipe works, voice may differ)
- [ ] Safari / Mobile Safari (test voice coach)
- [ ] Edge (should work identically to Chrome)

---

## MOBILE CHECKS (375px viewport)
- [ ] Landing page hero readable, prana rings visible
- [ ] Onboarding forms usable with virtual keyboard
- [ ] Bottom navigation not obscured by home bar
- [ ] Session page camera panel fills screen width
- [ ] Dashboard charts resize correctly

---

## PERFORMANCE CHECKS
- [ ] Landing → Dashboard load: under 3 seconds on 4G
- [ ] MediaPipe model: loads under 15 seconds on first visit (CDN)
- [ ] Routine generation: instant (under 50ms, pure JS)
- [ ] No visible frame drops in camera feed during pose detection
- [ ] Memory: no leak after 10+ minutes of continuous session

---

## DATA INTEGRITY
- [ ] Sessions stored in localStorage survive page refresh
- [ ] Profile survives page refresh
- [ ] Current routine survives page refresh
- [ ] Demo seed data loads on first visit (no prior sessions)
- [ ] Clearing session history removes all session cards from dashboard

---

## HACKATHON DEMO FINAL CHECK (5 minutes before)
- [ ] Live app open at /dashboard in a Chrome tab
- [ ] Second tab open at /session (pre-loaded)
- [ ] MediaPipe cached (visit /session once, camera enabled)
- [ ] Demo profile pre-filled (name: Shiva, 22, beginner, back pain + stress)
- [ ] Voice coach tested — speaks audibly through laptop speakers
- [ ] Screen brightness at 100%
- [ ] Do Not Disturb mode ON
- [ ] Notifications silenced
- [ ] Phone hotspot ready as internet backup
- [ ] Backup screen recording open in a third tab
- [ ] QR code to live URL visible and scannable
- [ ] Team members know their individual role explanations
