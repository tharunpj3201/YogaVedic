import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, getToken, setToken } from '../services/apiClient.js'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // restoring session on first load

  const restoreSession = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user: u } = await api.me()
      setUser(u)
    } catch {
      // Token invalid/expired — clear it silently and fall back to logged-out state.
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { restoreSession() }, [restoreSession])

  async function register({ name, email, password }) {
    const { token, user: u } = await api.register({ name, email, password })
    setToken(token)
    setUser(u)
    return u
  }

  async function login({ email, password }) {
    const { token, user: u } = await api.login({ email, password })
    setToken(token)
    setUser(u)
    return u
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  async function refreshUser() {
    const { user: u } = await api.me()
    setUser(u)
    return u
  }

  const value = { user, loading, isAuthenticated: Boolean(user), login, register, logout, refreshUser, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
