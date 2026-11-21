import jwt from 'jsonwebtoken'

// JWT_SECRET must be supplied through the environment. There is intentionally
// NO fallback value: a predictable default would let anyone forge valid tokens.
// The secret itself is never logged or included in error messages.
export const JWT_SECRET_MIN_LENGTH = 32

export function validateJwtSecret(secret = process.env.JWT_SECRET) {
  const help = `Generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
  if (typeof secret !== 'string' || secret.trim() === '') {
    throw new Error(`JWT_SECRET is not set. Configure a random secret of at least ${JWT_SECRET_MIN_LENGTH} characters. ${help}`)
  }
  if (secret.length < JWT_SECRET_MIN_LENGTH) {
    throw new Error(`JWT_SECRET is too short (minimum ${JWT_SECRET_MIN_LENGTH} characters). ${help}`)
  }
  // Reject values that still look like template/placeholder text.
  if (/^<.*>$/.test(secret.trim()) || /change|replace|placeholder|example/i.test(secret)) {
    throw new Error(`JWT_SECRET looks like a placeholder value. Replace it with a random secret. ${help}`)
  }
  return secret
}

let cachedSecret
function getSecret() {
  if (!cachedSecret) cachedSecret = validateJwtSecret()
  return cachedSecret
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided.' })
  let secret
  try {
    secret = getSecret()
  } catch (err) {
    console.error('Auth configuration error:', err.message)
    return res.status(500).json({ error: 'Server configuration error.' })
  }
  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, secret)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '30d' })
}
