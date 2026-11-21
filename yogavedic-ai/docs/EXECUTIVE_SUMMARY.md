# YogaVedic — Executive Summary

**Category:** HealthTech · AI · Wellness
**Stage:** Hackathon MVP (June 2026)

> Note: this is a hackathon-era product pitch. Pricing tiers, the roadmap and deployment statements describe plans and ideas, not implemented features. See the README for what the code actually does.

**Institution:** S-VYASA Deemed to be University, School of Computer Science
**Team:** 5 MCA Semester II students | Guide: Prof. Pankaja Benkal | Dean: Dr. Sachin Sharma

---

## The Problem

India has 93 million yoga practitioners — yet the vast majority practice without qualified guidance. Incorrect form causes roughly 30% of yoga-related injuries. Certified instruction costs ₹1,500–₹4,000 per class, and quality coaching simply doesn't reach Tier 2/3 cities, campuses, or elderly practitioners. The existing digital alternatives (YouTube, app videos) are one-way: they can't see you, so they can't correct you.

## The Solution

**YogaVedic** is a browser-based personal yoga coach. Using a standard smartphone or laptop camera, the platform:

1. **Detects yoga poses in real time** via Google's MediaPipe BlazePose — a neural network that extracts 33 body landmarks from a webcam feed.
2. **Corrects alignment instantly** by applying biomechanical angle checks to the landmark data and delivering voice corrections: *"Bend your front knee closer to a right angle."*
3. **Generates personalised routines** based on a 90-second user questionnaire covering age, fitness level, health conditions (back pain, stress, diabetes, weight loss, flexibility), and goals.
4. **Tracks progress** through an analytics dashboard with accuracy trends, weekly streaks, and calorie estimates.

All computer vision processing happens **in the browser** using WebAssembly. No video data leaves the user's device — a foundational privacy commitment.

## Technology

React 18 · TailwindCSS · Framer Motion · MediaPipe BlazePose (WASM/WebGL) · Web Speech API · Node.js/Express · MongoDB · JWT Authentication · Docker · Vercel (configuration included)

## Traction & Validation

- Working MVP with real-time pose detection (not deployed publicly)
- 12 poses across 7 health condition categories, drawn from clinical yoga research including S-VYASA's published studies on stress, back pain, and diabetes
- Demo data pipeline seeded with 14 days of session history for judging review
- Entire codebase built by the team — no templates, no mockups

## Market

- **TAM:** ₹4,800 Cr — Indian digital wellness market (18% CAGR)
- **SAM:** ₹620 Cr — yoga-specific digital coaching
- **SOM Y1:** ₹18 Cr — students, early adopters, 3 university contracts

## Business Model

- **Free tier:** beginner routines, basic dashboard (acquisition)
- **Premium:** ₹299/month or ₹1,999/year (advanced AI, analytics, offline packs)
- **University:** ₹50,000/year per campus (branded portal, admin dashboard)
- **Corporate:** ₹5,000/employee/year (team wellness, HR integration)

Break-even at ~800 paying users. Marginal cost per user is near zero — the AI runs on the user's hardware.

## Revenue Projections

| Year | Revenue | Net |
|---|---|---|
| Y1 | ₹15.6L | ₹13.5L |
| Y2 | ₹97.5L | ₹82L |
| Y3 | ₹4.2Cr | ₹3.5Cr |

## Roadmap

- **v1.1 (Q3 2026):** Firebase Auth, cloud session sync, PWA offline mode
- **v2.0 (Q1 2027):** Heart rate wearable integration, advanced ML quality classifier
- **v3.0 (Q3 2027):** Ayurvedic AI advisor, meditation coach, nutrition overlay
- **v3.1 (Q4 2027):** Razorpay subscription, institution API, UPI Autopay

## Why Now, Why S-VYASA

S-VYASA University was founded on integrating yoga with modern science. YogaVedic is the direct technological extension of that mission — making the university's evidence-based yoga expertise accessible to every smartphone user in India. We are not building despite our institution; we are building because of it.

---

*"Ancient yoga wisdom, powered by artificial intelligence."*

**Team YogaVedic · S-VYASA University · June 2026**
