// API Client — YogaVedic
// Thin fetch wrapper for the backend. Attaches the JWT automatically and
// normalizes errors so every caller can just `try { await api.x() } catch (e) { e.message }`.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const TOKEN_KEY = 'yv_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.')
  }

  let data = null
  try { data = await res.json() } catch { /* empty/non-JSON body is fine for some responses */ }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data || {}
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),
  updateProfile: (payload) => request('/users/profile', { method: 'PATCH', body: payload }),
  logSession: (payload) => request('/sessions', { method: 'POST', body: payload }),
  listSessions: (query = '') => request(`/sessions${query}`),
  sessionStats: () => request('/sessions/stats'),
  clearSessions: () => request('/sessions', { method: 'DELETE' }),
  chatMessage: (payload) => request('/chat/message', { method: 'POST', body: payload })
}
