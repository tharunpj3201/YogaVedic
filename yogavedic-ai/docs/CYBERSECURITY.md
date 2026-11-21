# YogaVedic — Cybersecurity & Data Privacy Architecture

---

## THREAT MODEL (STRIDE)

| Threat | Vector | Control |
|---|---|---|
| **Spoofing** | JWT token theft | Short-lived tokens (30d), HTTPS only, HttpOnly cookies in Phase 2 |
| **Tampering** | Session data manipulation | Server-side validation, Mongoose schema enforcement |
| **Repudiation** | Disputed session logs | Immutable session records with timestamps + userId FK |
| **Information Disclosure** | DB breach | bcrypt-hashed passwords (12 rounds), no PII in logs |
| **Denial of Service** | API flooding | Phase 2: express-rate-limit (100 req/15min per IP) |
| **Elevation of Privilege** | Role bypass | Role field validated server-side on every admin route |

---

## SECURITY LAYERS

### Layer 1 — Transport
- All traffic over HTTPS/TLS 1.3 (enforced by Vercel + Railway)
- HSTS header set: `Strict-Transport-Security: max-age=31536000`
- CORS: restricted to known frontend origin only

### Layer 2 — Authentication
```
Register:  User password → bcrypt(12 rounds) → passwordHash stored
Login:     bcrypt.compare(input, hash) → JWT signed (HS256, 30d expiry)
Request:   Authorization: Bearer <jwt> → verified on every protected route
```

**JWT payload:**
```json
{ "userId": "...", "role": "user", "iat": 1234567890, "exp": 1237159890 }
```

No sensitive data in token payload. Token revocation via short expiry + refresh token (Phase 2).

### Layer 3 — Data Minimisation
- **Video:** Never stored, never transmitted. Processed in-browser WASM only.
- **Health data stored:** age, weight, height, conditions (text labels), goal (free text)
- **Session data stored:** duration, accuracy score (0-100), calorie estimate, pose IDs
- **Not stored:** facial images, GPS location, device fingerprint, precise heartbeat data

### Layer 4 — Input Validation
```javascript
// Mongoose schema enforces types and enums
fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
accuracy: { type: Number, min: 0, max: 100 }
```
All free-text fields sanitised with `trim()`. No raw HTML accepted. XSS surface is minimal (React's JSX escapes by default).

### Layer 5 — Secrets Management
- All secrets in environment variables, never in source code
- `.env` in `.gitignore` 
- JWT secret rotated on deployment
- Razorpay keys stored as Vercel/Railway environment secrets

---

## DATA PRIVACY — DISHA ALIGNMENT
*(Digital Information Security in Healthcare Act — India's health data framework)*

| Requirement | Our Implementation |
|---|---|
| Data minimisation | Collect only what the app uses: age, weight, height, conditions |
| Purpose limitation | Health data used only for routine generation, not sold/shared |
| User consent | Explicit consent checkbox at onboarding (Phase 2: formal consent modal) |
| Right to erasure | "Clear Session History" in Profile page; account deletion API endpoint |
| Data localisation | MongoDB Atlas India region (ap-south-1) for Indian users |
| Breach notification | Phase 2: automated alert if anomalous data access detected |

---

## ENCRYPTION STRATEGY

### Passwords
```
bcrypt(password, saltRounds=12)
→ $2a$12$[22-char salt][31-char hash]
→ Computationally infeasible to reverse even with GPU brute force
```

### Sensitive Profile Fields (Phase 2)
```javascript
// Field-level AES-256 encryption for weight, height, conditions
import crypto from 'crypto'
const FIELD_KEY = Buffer.from(process.env.FIELD_ENCRYPTION_KEY, 'hex') // 32 bytes

function encryptField(text) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', FIELD_KEY, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}
```

### In Transit
- TLS 1.3 end-to-end
- API responses include no sensitive fields by default
- `toSafeJSON()` on User model explicitly removes `passwordHash`

---

## AUTHENTICATION FLOW DIAGRAM

```
[Browser]          [Express API]         [MongoDB]
    │                    │                    │
    │ POST /auth/login   │                    │
    │ {email, password}  │                    │
    │──────────────────▶ │                    │
    │                    │ findOne({email})   │
    │                    │──────────────────▶ │
    │                    │ ◀── user doc ───── │
    │                    │                    │
    │                    │ bcrypt.compare()   │
    │                    │ [in-process, no DB]│
    │                    │                    │
    │ ◀── {token, user} ─│                    │
    │                    │                    │
    │ GET /api/sessions  │                    │
    │ Authorization: Bearer <token>           │
    │──────────────────▶ │                    │
    │                    │ jwt.verify(token)  │
    │                    │ req.user = payload │
    │                    │──────────────────▶ │
    │ ◀── {sessions} ────│◀── sessions ────── │
```

---

## SECURITY TESTING CHECKLIST

### Before Hackathon Demo
- [ ] No API keys or secrets in frontend code (check with `grep -r "sk_" src/`)
- [ ] CORS allows only localhost:5173 and production domain
- [ ] JWT secret is not the default dev string in production
- [ ] MongoDB connection string not visible in any log output
- [ ] No `console.log(user)` with sensitive fields in production build

### Known Limitations (Honest Disclosure for Judges)
1. **Rate limiting** not yet implemented — planned Phase 2 with express-rate-limit
2. **Refresh tokens** not yet implemented — single 30-day JWT
3. **HTTPS** depends on deployment platform (Vercel handles it; local dev is HTTP)
4. **CSRF protection** not applicable (JWT in Authorization header, not cookies)

---

## BLOCKCHAIN WELLNESS CERTIFICATES (Phase 4 Vision)

```
User completes 30-day challenge
       ↓
Backend generates achievement JSON:
{ userId, challenge, completedAt, avgAccuracy, totalSessions }
       ↓
Hash with SHA-256
       ↓
Mint NFT on Polygon (low gas fees, eco-friendly PoS)
       ↓
Certificate URL shared to LinkedIn / university portal
```

*This creates tamper-proof, verifiable wellness achievements — relevant for university accreditation and corporate HR records.*
