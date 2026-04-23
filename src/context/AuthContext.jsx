import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'acutrace_token'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem(TOKEN_KEY)
    if (!t) return null
    try {
      // Decode JWT payload (no verification — server validates on each request)
      const payload = JSON.parse(atob(t.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY)
        return null
      }
      return { username: payload.sub }
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
  })

  const saveToken = useCallback((raw) => {
    localStorage.setItem(TOKEN_KEY, raw)
    setToken(raw)
    try {
      const payload = JSON.parse(atob(raw.split('.')[1]))
      setUser({ username: payload.sub })
    } catch {
      setUser(null)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem('analysisResults')
    setToken(null)
    setUser(null)
  }, [])

  const authFetch = useCallback(async (path, options = {}) => {
    const headers = { ...(options.headers || {}) }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    if (res.status === 401) {
      logout()
      throw new Error('Session expired. Please log in again.')
    }
    return res
  }, [token, logout])

  return (
    <AuthContext.Provider value={{ user, token, saveToken, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
