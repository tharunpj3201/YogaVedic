# YogaVedic - Development Progress

Product name: **YogaVedic** (previously "YogaVedic AI").

## Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Branding: rename "YogaVedic AI" to "YogaVedic" (branding only, no functional changes) | Complete |
| 2 | Security audit (inspection only; no code changed) | Complete (report delivered; findings tracked below) |
| 2 / Fix 1 | Repository and Docker ignore rules (audit finding M1) | Complete (see below) |
| 2 / Fix 2 | JWT secret configuration (audit H1) | Complete (see below); not tested against a running MongoDB |
| 2 / Public-repo prep | README rewrite, guarded seed script, Mongo host port on loopback, AI-claim corrections (audit M5, part of H2, part of M6) | Complete (see below) |
| 2 / Fix 4+ | Remaining audit findings (MongoDB authentication, rate limiting, error-message leakage, CDN script pinning, dependency advisories, etc.) | Not started - awaiting approval |
| 3+ | To be defined | Not started |

## Phase 1 - Branding rename

**Status:** Complete

Changes: user-facing name updated in the landing page, login/register/onboarding headers, loading screen, browser tab title,
chat assistant text and system prompts, locale taglines (en/hi/kn/ta/te), backend health response and startup log,
README, docs/, and source-file header comments.

Follow-up correction (applied after review): the browser tab title in `frontend/index.html` was changed from
"YogaVedic — Ancient Yoga Wisdom Powered by AI" to "YogaVedic — Real-Time Yoga Posture Analysis", so the title no
longer carries the old "Powered by AI" wording. No other files were modified for this correction.

Intentionally unchanged: package names, folder name `yogavedic-ai`, DB name, container names, env vars, JWT default
secret string, seed admin email `admin@yogavedic.ai`, and the historical title in CHANGES.md.

Checks run (all passed):
- `npm ci` + `npm run build` (frontend): exit 0; built bundle contains no "YogaVedic AI"
- `npx eslint src --ext js,jsx`: exit 0
- All 5 locale JSON files parse
- `node --check` on backend `server.js` and `routes/chat.js`: OK

Follow-up checks (title correction): `index.html` title line verified by grep; `npm ci` + `npm run build` re-run, exit 0,
and the built `dist/index.html` contains the new title.

Not run: unit tests (no test script in package.json); manual browser/Docker check; backend runtime (needs MongoDB).

## Phase 2 - Security Fix 1: repository and Docker ignore rules

**Status:** Complete (ignore rules only; no other audit finding has been fixed)

Files created (no existing file was modified or deleted, other than this progress file):
- `.gitignore` (project root): ignores `.env` and `.env.*` variants at any depth while keeping `.env.example`; node_modules;
  dist/build output and caches; coverage; logs; OS metadata; editor folders; temp files; private keys and certificates.
  Lockfiles, JSON files, docs and source are deliberately not ignored.
- `backend/.dockerignore`: build context for `./backend`. Keeps `package*.json` and `src/`; excludes env files, `.git`,
  node_modules, build output, logs, keys/certs, OS/editor files.
- `frontend/.dockerignore`: build context for `./frontend`. Same exclusions, while keeping everything the build needs
  (`index.html`, `src/`, vite/tailwind/postcss configs, lockfile, `nginx.conf`).
- No root `.dockerignore` was created: `docker-compose.yml` only uses `./backend` and `./frontend` as build contexts.

Checks actually performed (in a scratch copy under /tmp; the project directory was not turned into a Git repository):
- `git check-ignore` on 31 dummy sensitive/junk paths: all ignored. 29 required project files: none ignored.
- `git add -A --dry-run`: only the two `.env.example` files from the env family would be staged; no dummy secret, dependency,
  build or log file would be.
- Docker contexts: Docker is not available in this environment, so the `.dockerignore` rules were checked with a small
  matcher that follows Docker's documented pattern rules (self-tested). Junk files were excluded and every build input
  (all 10 backend and 43 frontend `src` files, lockfiles, configs, nginx.conf) was kept.
- Dockerfile steps replayed on the filtered contexts: frontend `npm ci` + `npm run build` exit 0; backend `npm ci --omit=dev`
  exit 0 and `node --check` passed on all backend source files.
- An actual `docker build` / `docker compose` run was NOT performed.

Needs manual attention:
- No real `.env` file or private key exists in the uploaded project, and a secret-pattern scan found nothing. Local `.env`
  files on developer machines were not visible and must be reviewed by their owners.
- `docker-compose.yml` still contains the JWT fallback default and an unauthenticated, published MongoDB (audit H1/H2). Not changed.
- Vite inlines `VITE_*` values from env files at build time. Because `frontend/.dockerignore` excludes env files, a local
  `frontend/.env` is no longer picked up by the Docker build (the app falls back to its built-in default API URL). If a
  different API URL is needed in Docker, it must later be passed explicitly (for example as a build argument).

Limits of this fix: ignore rules only affect future commits and image builds. They do not remove anything already committed
or shared, and do not make an env file safe. If a repository with history exists elsewhere, it still needs a separate review
and any exposed secret should be rotated.

## Phase 2 - Security Fix 2: JWT secret configuration

**Status:** Complete for the code and configuration changes. Full login flow not tested against a real database (see below).

Files modified:
- `backend/src/middleware/auth.js`: removed the hardcoded fallback secret. Added `validateJwtSecret()` (secret must be set,
  at least 32 characters, and not placeholder-looking). The secret is resolved from the environment on first use. Token
  expiry (30 days) and the signing/verifying calls are unchanged. If the secret is somehow missing at request time, the
  middleware returns a generic 500 instead of reporting a bad token.
- `backend/src/server.js`: calls `validateJwtSecret()` as the first step of startup, before connecting to MongoDB. On
  failure it logs a clear message (never the secret) and exits with code 1.
- `docker-compose.yml`: `JWT_SECRET` now uses required-variable syntax (`${JWT_SECRET:?message}`) with no default.
  Compose stops with an explanatory message if it is unset or empty. No secret is stored in the file.
- `backend/.env.example`: placeholder only, plus instructions for generating a random secret locally.
- `README.md`: added a short "Configuration: JWT_SECRET" section, noted the requirement in the Docker and deployment steps.

Checks actually performed (scratch copy under /tmp, Node v22; the Dockerfiles use Node 20):
- `node --check` on all backend source files: passed.
- Real `node src/server.js` runs: missing, empty, whitespace-only, 31-character, bracketed-placeholder, placeholder-like and the
  former fallback string (set explicitly) were all rejected with exit code 1. A random 96-character secret, set in the
  environment and via a `.env` file, passed validation and stopped only at the MongoDB connection (no MongoDB available).
  No output contained the secret.
- Behaviour tests (17 checks, all passed): token round trip, expiry still exactly 30 days, tampered, expired and
  wrong-secret tokens rejected with 401, real route modules return 401 without a token, `/api/routines/favourites` returns
  200 and `/api/chat/message` passes authentication with a valid token, and the validator edge cases.
  (One of my own test assertions initially failed because of a test-script mistake, not the code; it was fixed and rerun.)
- Compose file parses as YAML; static check confirms the required-variable syntax, no default, and no literal secret.
- Leak scan: neither old fallback string appears anywhere in the project; no long hex/key-like strings were added.

Not performed:
- No login/register test and no test of database-backed routes (no MongoDB available).
- No `docker compose` run (Docker not available), so the compose error message was not seen live.
- No frontend build or lint (no frontend files changed).
- No repository existed to inspect for the old fallback in Git history.

Manual configuration required: every environment (local `.env`, Docker Compose `.env` or shell, hosting provider) must set
`JWT_SECRET` to a random value of at least 32 characters. Anyone who ran with the old fallback should set a new secret;
existing tokens will then stop working and users must sign in again.

Remaining risks: tokens remain valid for 30 days with no revocation; the seed script, open MongoDB, missing rate limiting,
error-message leakage and the other audit findings are untouched. `docker compose` commands that parse the file (including
`down` and `logs`) will also stop until `JWT_SECRET` is set.

## Phase 2 - Public GitHub repository preparation

**Status:** Complete for the four requested areas. The project has not been deployed or published.

Files modified:
- `README.md`: rewritten. Describes MediaPipe pose detection (pre-trained model, no custom training), rule-based checks
  (live checks for 5 of 12 poses), voice coaching (Web Speech API), 5-language support, the Express/MongoDB backend, local
  setup, guarded seeding, privacy and security notes, known limitations. Demo passwords, invented screenshots, CI/CD and
  the MIT claim were removed.
- `backend/src/seed/seed.js`: refuses `NODE_ENV=production`; refuses non-local MongoDB hosts without `--allow-remote`; refuses to
  delete existing users/sessions without `--confirm-delete`; no hardcoded passwords (uses `SEED_PASSWORD`, or a random
  per-run password printed once).
- `docker-compose.yml`: MongoDB host port is now `127.0.0.1:27017:27017`. Nothing else changed.
- `frontend/index.html`: meta description no longer claims "AI-powered".
- `frontend/src/pages/LandingPage.jsx`, `SessionPage.jsx`, `OnboardingPage.jsx`: removed inaccurate "AI" wording (rule-based
  generator, keyword matching, voice coach).
- `frontend/src/locales/{en,hi,kn,ta,te}-IN.json`: five `ui` strings per file reworded (key names unchanged; all 157 keys
  still present in every file).
- `frontend/src/data/nlpTranslations.js`: chatbot "how does it work" answers now say pose detection tracks landmarks and
  that spoken corrections apply to supported poses; also fixed the old brand still present in the Hindi, Kannada, Tamil and
  Telugu pricing answers (missed in Phase 1 because it was transliterated).
- `docs/ARCHITECTURE.md`, `docs/EXECUTIVE_SUMMARY.md`, `docs/FINAL_ZIP_CONTENTS.md`, `docs/CYBERSECURITY.md`: removed claims of
  a non-existent GitHub Actions workflow, "deployed at launch" and unbenchmarked frame-rate figures; added "planned, not
  implemented" labels and a note that the pitch figures are plans.
- `docs/API_DOCUMENTATION.yaml`: example passwords replaced with a placeholder.
- `DEVELOPMENT_PROGRESS.md`: this entry.

Checks actually performed (scratch copies under /tmp):
- Frontend `npm ci`, `npm run lint` (exit 0) and `npm run build` (exit 0). Built output contains no "AI-powered" or "YogaVedic AI".
- All 5 locale files are valid JSON with identical key sets, unchanged from the previous version.
- Backend `node --check` on all source files: passed. Startup still fails without `JWT_SECRET` and passes validation with a valid one.
- Seed script, 16 scenarios run against an in-memory stand-in for the `mongoose` package (no real MongoDB was available):
  production (including case/whitespace variants), `mongodb+srv`, remote, look-alike and userinfo-trick hosts were refused
  before any connection; an empty database seeded with no flag; a non-empty database was refused and nothing was deleted
  without `--confirm-delete`, and was replaced with it; short `SEED_PASSWORD` refused; supplied and random passwords were
  used for all users and never echoed in full except the one-time random value; none of the old seed passwords reappeared.
- Scan of the whole project for the 3 old seed passwords and 2 old JWT fallbacks: 0 occurrences.
- `docker-compose.yml` and `docs/API_DOCUMENTATION.yaml` parse as YAML; compose diff is exactly the port line plus a comment.
- README checked for: no MIT claim, no custom-model claim, no screenshots, no CI claim, no demo credentials, and all 12 pose
  names verified against the code.

Not performed:
- No `docker build` or `docker compose up` (Docker not available). The Mongo port change is verified by file diff only.
- No run against a real MongoDB; no login/register or seed run against a real database.
- No browser test of the UI strings, camera, voice or translations.
- The Hindi, Kannada, Tamil and Telugu wording changes were written without a native-speaker review.

Findings noticed but NOT changed (outside the requested scope):
- `frontend/src/tests/unit.test.js` cannot run: `vitest` is not a dependency, there is no test script, and its relative import
  paths are wrong. With only the path corrected, in a scratch copy, all 22 tests passed. The latest `vitest` also conflicts with
  the project's Vite version, so a compatible version must be chosen.
- CORS allows one origin and `docker-compose.yml` sets it to `http://localhost:5173`, while the nginx frontend is served on port
  80, so the Docker-served UI is likely blocked from calling the API (code reading; not run).
- No LICENSE file exists. None was added; choosing a license is the owner's decision.
- `docs/` still holds hackathon-era pitch material (judge Q&A, winning strategy, pitch scripts, business model, names of
  team members and faculty). Consider removing or trimming it before making the repository public.
- All other audit findings remain open: MongoDB still has no authentication, no rate limiting, error messages still returned to
  clients, CDN scripts unpinned, dependency advisories, privacy wording beyond the pose/voice claims.
