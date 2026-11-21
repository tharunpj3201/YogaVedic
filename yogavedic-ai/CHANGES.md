# YogaVedic AI — Pose Images + Multi-Language Voice Coach

What changed in your existing codebase, and how to run it.

## New files

| File | Purpose |
|---|---|
| `src/data/poseImages.jsx` | 12 line-art SVG illustrations (one per pose in `routines.js`), with a dashed alignment guide on each |
| `src/components/PoseReference.jsx` | The "Reference Pose" panel — illustration + instructions + a Full View modal |
| `src/components/PoseReadiness.jsx` | "Pose Readiness" ring + live checklist (Good / Adjust tags), driven by your existing `evaluateChecks()` output |
| `src/components/VoiceCoachPanel.jsx` | "AI Coach (Voice)" card with an animated waveform while speech is playing |
| `src/components/LanguageSelector.jsx` | Header dropdown — switches language instantly, no reload |
| `src/contexts/LanguageContext.jsx` | App-wide language state (persisted to localStorage), `t()` for UI strings, `phrase()` for voice templates |
| `src/locales/{en,hi,kn,ta,te}-IN.json` | UI strings + voice phrase templates per language |
| `src/data/checkFeedbackTranslations.js` | Translations for the 9 biomechanical check messages (spine alignment, knee angle, etc.) used in `routines.js` |

## Changed files

- **`src/services/voiceCoach.js`** — now language-aware (`setVoiceLanguage()` picks the right installed browser voice) and adds a **continuous coaching loop**: every ~8s during a hold, the coach speaks a gentle check-in line if nothing more important (a correction/praise) has spoken recently. No more silence during long holds.
- **`src/services/languageService.js`** — already existed as a stub in your package; left as-is (it was already correctly localizing check feedback). I added `getBestVoiceForLanguage()` to it for the voice coach to use.
- **`src/hooks/useSession.js`** — speaks localized phrases (pose intro, session complete, etc.), starts/stops the continuous loop with session state, exposes `checkResults` for the new readiness panel.
- **`src/pages/SessionPage.jsx`** — rebuilt the layout into the 3-column structure from your screenshots: **Reference Pose | Camera | Readiness/Voice**. All English-only check feedback from `poseAnalysis.js` is localized before it's shown or spoken.
- **`src/App.jsx`** — wrapped routes in `<LanguageProvider>`.
- **`src/components/Layout.jsx`** — added a slim header bar with the language selector, visible on every page.

## Nothing touched
`poseAnalysis.js` (your biomechanical geometry/thresholds), `useMediaPipe.js`, `routines.js`, the backend, and all other pages are untouched. The 12 pose `id`s already in `routines.js` line up exactly with the new illustration keys, so no data migration was needed.

## Run it

```bash
cd yogavedic-ai/frontend
npm install
npm run dev
```

Already verified `npm run build` completes cleanly.

## Notes on voice languages

Hindi/Kannada/Tamil/Telugu speech quality depends on what TTS voices are installed in the browser/OS. Chrome on Android and Windows ship Indian-language voices by default; if a language has no matching voice installed, the browser falls back to its default voice but still reads the (correct) translated text — it just won't sound native. No code changes needed if better voices get installed later; `getBestVoiceForLanguage()` will pick them up automatically.

## If you want photo-realistic pose images instead of line-art later
Swap the implementation inside `getPoseIllustration()` in `poseImages.jsx` to return an `<img>` tag pointing at real photos/AI-generated images instead of the inline SVGs — `PoseReference.jsx` doesn't care what `Illustration` renders, so the rest of the integration stays the same.
