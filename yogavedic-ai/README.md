# YogaVedic

YogaVedic is a browser-based yoga practice assistant. It uses your webcam to detect body landmarks in real time, checks alignment with hand-written rules, and coaches you by voice in five languages. A Node.js/Express and MongoDB backend handles accounts, profiles and session history.

> **Status:** portfolio / learning project. It is not a medical product and is not hardened for production use (see [Security notes](#security-notes) and [Known limitations](#known-limitations)).

## Key features

- **Real-time pose detection** in the browser with Google's pre-trained MediaPipe Pose model (33 body landmarks per frame).
- **Rule-based posture feedback** - joint-angle, vertical-alignment and level checks on the detected landmarks, with an on-screen skeleton overlay and a per-pose accuracy score.
- **Voice coaching** - spoken corrections and session prompts using the browser's Web Speech API, plus optional hands-free voice commands (next, pause, resume, repeat, exit) where the browser supports speech recognition.
- **Multilingual interface** - UI text, voice feedback and chat answers in English (India), Hindi, Kannada, Tamil and Telugu.
- **Personalised routines** - an onboarding questionnaire (age, fitness level, health goals) feeds a deterministic routine generator that builds warm-up, core and cool-down sequences for a chosen duration.
- **Progress dashboard** - session history, accuracy trends, streaks and estimated calories (charts built with Recharts).
- **In-app chat assistant** - answers questions about the app and yoga basics. If the backend has an OpenAI API key configured it uses an OpenAI chat model; otherwise it falls back to an offline keyword-matching assistant in the browser.
- **Accounts and persistence** - register/login with JWT authentication; profile and session data stored in MongoDB.

## How the pose analysis works

1. The camera stream is processed **in the browser** by MediaPipe Pose (BlazePose, via the `@mediapipe/pose` package). Video frames are not uploaded by the application.
2. The model returns 33 landmarks per frame. **The model is Google's pre-trained one, used as-is - this project does not train or fine-tune any model.**
3. `poseAnalysis.js` evaluates hand-written rules for the current pose: the angle at a joint, the deviation from vertical along a chain of joints, or whether two landmarks are level.
4. The accuracy score is simply the percentage of visible checks that currently pass.
5. Failed checks become short corrective messages, which the voice coach speaks (throttled so it does not repeat constantly).

**Pose library:** 12 poses (Mountain Pose, Tree Pose, Warrior II, Triangle Pose, Easy Seated Breathing, Child's Pose, Downward Dog, Cobra Pose, Bridge Pose, Cat-Cow Flow, Seated Forward Bend and Relaxation Pose). Live correction is implemented for the 5 poses whose alignment can be judged reliably from a front-facing webcam: **Mountain Pose, Tree Pose, Warrior II, Triangle Pose and Easy Seated Breathing**. The other 7 are included with instructions and benefits but have no live checks yet.

## Tech stack

| Area | Technology |
|------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Recharts |
| Pose detection | MediaPipe Pose (`@mediapipe/pose`, camera and drawing utilities) |
| Voice | Web Speech API (speech synthesis; speech recognition for commands) |
| Backend | Node.js 20, Express 4, Mongoose 8 (ES modules) |
| Database | MongoDB 7 |
| Auth | JWT (`jsonwebtoken`), password hashing with `bcryptjs` |
| Chat (optional) | OpenAI Chat Completions API (`gpt-4o-mini`), called from the backend only |
| Packaging | Docker, Docker Compose, nginx (static frontend) |

## Getting started (local development)

### Prerequisites

- Node.js 20 or newer and npm
- MongoDB running locally, or Docker (to run MongoDB in a container)
- A modern desktop browser with a webcam (Chrome or Edge recommended; speech recognition support varies by browser)
- Internet access on first load - the MediaPipe runtime and model files are fetched from a CDN (jsDelivr)

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

- `MONGO_URI` - your MongoDB connection string (for example `mongodb://127.0.0.1:27017/yogavedic`).
- `JWT_SECRET` - **required**, at least 32 random characters. The server refuses to start without it. Generate one locally:

  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

- `OPENAI_API_KEY` - optional. Leave empty to use the offline chat assistant.

Then install and start:

```bash
npm install
npm run dev        # API on http://localhost:4000
```

No local MongoDB? Start one in Docker from the repository root. Docker Compose validates the whole file, so `JWT_SECRET` must be set in your shell or in a `.env` file next to `docker-compose.yml` (that file is git-ignored):

```bash
docker compose up -d mongo     # exposed on 127.0.0.1:27017 only
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env           # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                    # http://localhost:5173
```

Open http://localhost:5173, create an account, complete onboarding, and allow camera access when a session starts.

### Optional: demo data

`npm run seed` (from `backend/`) creates two demo users, one admin-role user and 14 days of sample sessions. It is **destructive and development-only**:

- It refuses to run when `NODE_ENV=production`.
- It refuses to run against a non-local MongoDB unless you pass `--allow-remote`.
- If the database already contains users or sessions, it stops without deleting anything unless you pass `--confirm-delete`.
- No password is stored in the repository. Set `SEED_PASSWORD` (12+ characters) to choose one, or let the script generate a random password and print it once in your terminal.

```bash
npm run seed                      # empty database
npm run seed -- --confirm-delete  # replaces ALL existing users and sessions
```

Run it on your host against a local database. It will not run inside the Docker backend container, which sets `NODE_ENV=production`.

## Docker Compose

```bash
# JWT_SECRET must be set (shell variable or .env next to docker-compose.yml)
docker compose up --build
```

This starts MongoDB (bound to `127.0.0.1` only), the API on port 4000 and the nginx-served frontend on port 80.

**Known issue:** the API allows a single CORS origin, and `docker-compose.yml` sets `FRONTEND_URL` to `http://localhost:5173` (the Vite dev server). A frontend served by the nginx container on port 80 is a different origin, so browser requests to the API may be blocked unless `FRONTEND_URL` is changed. For day-to-day development, use the npm workflow above.

## Project structure

```text
.
├── backend/
│   ├── src/
│   │   ├── server.js            # Express app, CORS, startup checks
│   │   ├── middleware/auth.js   # JWT signing/verification, JWT_SECRET validation
│   │   ├── models/              # User, Session (Mongoose)
│   │   ├── routes/              # auth, users, sessions, routines, chat
│   │   └── seed/seed.js         # guarded development seed script
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/               # Landing, Login, Register, Onboarding, Dashboard, Routine, Session, Profile
│   │   ├── components/          # chat assistant, voice panel, accuracy ring, language selector, ...
│   │   ├── hooks/               # useMediaPipe, useSession, useVoiceCommands, ...
│   │   ├── services/            # poseAnalysis, routineGenerator, voiceCoach, nlpService, storage, API client
│   │   ├── data/                # pose library, chat answers
│   │   └── locales/             # en-IN, hi-IN, kn-IN, ta-IN, te-IN
│   ├── nginx.conf, Dockerfile, vercel.json
├── docs/                        # architecture and planning documents (see note below)
├── docker-compose.yml
└── DEVELOPMENT_PROGRESS.md
```

## Backend API

All routes except register and login require an `Authorization: Bearer <token>` header.

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/register`, `/api/auth/login` | Create account / sign in |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/users/profile` | Update profile |
| GET | `/api/users/leaderboard` | Top users by session stats |
| POST / GET / DELETE | `/api/sessions` | Save, list and clear session history |
| GET | `/api/sessions/stats` | Aggregate statistics |
| GET / POST | `/api/routines/favourites` | Favourites (placeholder implementation) |
| POST | `/api/chat/message` | Chat assistant (OpenAI if configured, otherwise fallback signal) |
| GET | `/health` | Health check |

An OpenAPI description is in `docs/API_DOCUMENTATION.yaml`; it may lag behind the code.

## Privacy

- Camera video is processed locally in your browser and is not uploaded by this application.
- Profile details (age, height, weight, health goals) and session history are stored in MongoDB and cached in the browser.
- If an OpenAI key is configured on the backend, chat messages you type are sent to OpenAI to generate replies.
- Voice commands use the browser's speech recognition; in some browsers (for example Chrome) audio is processed by the browser vendor's cloud service.

## Security notes

- `JWT_SECRET` has no default and must be at least 32 characters; startup fails otherwise.
- `.gitignore` and `.dockerignore` files keep `.env` files, keys and dependencies out of Git and Docker images. Never commit real secrets.
- MongoDB in `docker-compose.yml` is published on `127.0.0.1` only. It does not yet require authentication, so do not expose it to a network.
- Not yet implemented: rate limiting, security headers (helmet), token revocation. Tokens last 30 days and the frontend stores them in `localStorage`.
- Report security issues privately to the repository owner rather than opening a public issue.

## Scripts

| Where | Command | What it does |
|-------|---------|--------------|
| `backend/` | `npm run dev` / `npm start` | Start the API with / without nodemon |
| `backend/` | `npm run seed` | Guarded development seed (see above) |
| `frontend/` | `npm run dev` | Vite dev server on port 5173 |
| `frontend/` | `npm run build` / `npm run preview` | Production build / preview it |
| `frontend/` | `npm run lint` | ESLint |

## Testing

`frontend/src/tests/unit.test.js` contains unit tests for the pose-analysis math, routine generator and statistics. They are **not wired into the project yet**: `vitest` is not a declared dependency, there is no `test` script, and the file's relative import paths need correcting before it can run. Linting and the production build are the checks currently available. There is no CI workflow.

## Known limitations

- Live posture correction covers 5 of the 12 poses; the rest are instruction-only.
- Feedback comes from fixed thresholds, not from a trained assessment model, and is not a substitute for a qualified instructor.
- Accuracy depends on lighting, camera angle and how much of your body is in frame.
- Calorie figures are rough estimates from the routine, not measurements.
- Translations for Hindi, Kannada, Tamil and Telugu may need native-speaker review. Speech voices depend on what your browser or operating system provides.
- The `docs/` folder includes hackathon-era pitch and planning material. Pricing, roadmap and business statements there describe ideas, not implemented features.

## Health disclaimer

YogaVedic is for general wellness and education. It does not diagnose or treat any condition. Consult a qualified professional before starting a new exercise routine, especially if you have a medical condition.

## License

No license file has been added to this repository yet, so no open-source license is granted; all rights are reserved by default. A license (for example MIT) should be added by the repository owner before inviting reuse or contributions.

## Acknowledgements

Pose detection is provided by [MediaPipe](https://developers.google.com/mediapipe) from Google. Built with React, Vite, Tailwind CSS, Express and MongoDB.
