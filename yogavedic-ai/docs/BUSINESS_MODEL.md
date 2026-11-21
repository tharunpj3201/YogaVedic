# YogaVedic — Business Model & Financial Projections

---

## REVENUE MODEL

### Tier Structure

| Tier | Price | Target User | Key Features |
|---|---|---|---|
| **Free** | ₹0 | Students, general users | Beginner routines, basic dashboard, 10-min sessions |
| **Premium** | ₹299/mo or ₹1,999/yr | Enthusiasts, professionals | All routines, saved sequences, detailed analytics, priority voice, PDF progress reports |
| **University** | ₹50,000/yr per campus | Educational institutions | Branded portal, SSO, admin panel, bulk user management, usage analytics |
| **Corporate** | ₹5,000/employee/yr | Enterprises (min 20 employees) | Team challenges, HR wellness dashboard, API integration, dedicated support |
| **Ayurvedic Clinic** | ₹15,000/mo per practitioner | Wellness clinics, hospitals | Patient-specific prescriptions, clinical progress reports, EHR integration |

---

## FINANCIAL PROJECTIONS

### Assumptions
- Customer Acquisition Cost (CAC): ₹200 (organic/campus referral model)
- Monthly Churn: 4% (premium), 10% (institutional — typically renew annually)
- Gross Margin: 91% (near-zero compute cost, hosting ~₹8K/month for 10K users)
- Conversion Rate: 3% free → premium (industry benchmark: 2–5%)

---

### Year 1 (June 2026 – May 2027)

| Revenue Stream | Units | Rate | Annual Revenue |
|---|---|---|---|
| Premium (annual plan) | 400 users | ₹1,999/yr | ₹7,99,600 |
| Premium (monthly, avg 6mo) | 200 users | ₹299×6 | ₹3,58,800 |
| University contracts | 3 campuses | ₹50,000 | ₹1,50,000 |
| Corporate (pilot) | 2 orgs × 25 emp | ₹5,000 | ₹2,50,000 |
| **TOTAL** | | | **₹15,58,400** |

*Costs: Hosting ₹96K, Tools ₹24K, Marketing ₹1.5L → Net: ~₹13.5L*

---

### Year 2 (June 2027 – May 2028)

| Revenue Stream | Units | Rate | Annual Revenue |
|---|---|---|---|
| Premium | 3,500 users | ₹1,999/yr avg | ₹69,96,500 |
| University | 15 campuses | ₹50,000 | ₹7,50,000 |
| Corporate | 8 orgs × 50 emp | ₹5,000 | ₹20,00,000 |
| **TOTAL** | | | **₹97,46,500** |

*Operating costs: ₹15L → Net: ~₹82L*

---

### Year 3 (June 2028 – May 2029)

| Revenue Stream | Units | Rate | Annual Revenue |
|---|---|---|---|
| Premium | 12,000 users | ₹1,999/yr | ₹2,39,88,000 |
| University | 50 campuses | ₹50,000 | ₹25,00,000 |
| Corporate | 30 orgs × 80 emp | ₹5,000 | ₹1,20,00,000 |
| Ayurvedic Clinic | 20 clinics | ₹15,000/mo | ₹36,00,000 |
| **TOTAL** | | | **₹4,20,88,000** |

*Profitability milestone: ~800 premium users (Month 7 of Year 1)*

---

### 5-Year Summary

| Year | Revenue | Net Profit | Users |
|---|---|---|---|
| Y1 | ₹15.6L | ₹13.5L | 15,000 free / 600 paid |
| Y2 | ₹97.5L | ₹82L | 80,000 free / 3,500 paid |
| Y3 | ₹4.2Cr | ₹3.5Cr | 350,000 free / 12,000 paid |
| Y4 | ₹12Cr | ₹10Cr | International expansion |
| Y5 | ₹28Cr | ₹24Cr | SEA + diaspora markets |

---

## GO-TO-MARKET STRATEGY

### Phase 1: Campus Launch (Months 1–6)
- Deploy free at S-VYASA for all MCA/health science students
- Collect testimonials, accuracy data, and usage analytics
- Campus ambassador programme: 20 student reps get premium free
- Target: 5,000 active users, 3 university contracts

### Phase 2: Content + Organic (Months 6–18)
- Instagram Reels: 30-second clips of AI correcting poses (inherently shareable)
- YouTube: "AI vs Instructor" comparison videos
- Corporate HR partnerships: pitch at 3 HR tech conferences
- Target: 30,000 users, 10 university + 5 corporate deals

### Phase 3: Paid Growth + International (Year 3+)
- Google/Meta ads targeting yoga + health search terms
- Partnership with Cult.fit, HealthifyMe for cross-promotion
- International: Indian diaspora in UAE, UK, USA (30M people)
- Target: 100,000 paying users

---

## FINTECH EXTENSION

### Subscription Infrastructure

```
User → Razorpay Checkout → Payment Verified
              ↓
       Webhook to Backend (/api/payments/webhook)
              ↓
       User.subscription = { plan, expiresAt, razorpaySubscriptionId }
              ↓
       Feature Gates: Premium routes check subscription middleware
```

### Razorpay Integration Plan

```javascript
// backend/src/routes/payments.js
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// POST /api/payments/create-subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID_PREMIUM,
    customer_notify: 1,
    total_count: 12, // 12 months
    notes: { userId: req.user.userId }
  })
  res.json({ subscriptionId: subscription.id })
})

// POST /api/payments/webhook (Razorpay signature verified)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['x-razorpay-signature']
  // Verify HMAC signature
  // Update user subscription status in MongoDB
  res.json({ received: true })
})
```

### UPI Integration
- Razorpay handles UPI, cards, net banking natively
- One-click UPI Autopay for recurring subscriptions
- Webhook-driven subscription lifecycle (created → active → halted → cancelled)

### Feature Gating Middleware
```javascript
export function requirePremium(req, res, next) {
  const sub = req.dbUser?.subscription
  if (!sub || new Date(sub.expiresAt) < new Date()) {
    return res.status(403).json({ error: 'Premium subscription required.', upgradeUrl: '/upgrade' })
  }
  next()
}
```

---

## PRICING RATIONALE

**Why ₹299/month?**
- Less than one cup of Starbucks coffee per day
- 85% cheaper than one yoga class with a certified instructor
- Price anchoring: annual plan at ₹1,999 = ₹166/month, creating urgency to commit

**Why ₹50,000/year for universities?**
- Average university spends ₹2–5L/year on physical wellness infrastructure
- We replace nothing — we augment the existing wellness programme
- ROI for the university: measurable student wellness outcomes for accreditation

**Freemium conversion playbook:**
1. Free user hits "Advanced Routine" → Premium gate → one-tap upgrade
2. After 5 sessions, show "You've improved 18% — unlock full analytics" 
3. Weekly email: "Your streak is at risk — premium users get reminder nudges"
