import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import API_BASE from '../utils/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const { saveToken } = useAuth()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  function validate() {
    const errs = {}
    if (!username.trim()) errs.username = 'Username is required'
    else if (username.trim().length < 3) errs.username = 'At least 3 characters'
    if (!password) errs.password = 'Password is required'
    else if (mode === 'register') {
      if (password.length < 8) errs.password = 'At least 8 characters'
      else if (!/[A-Z]/.test(password)) errs.password = 'Must contain an uppercase letter'
      else if (!/\d/.test(password)) errs.password = 'Must contain a digit'
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const errs = validate()
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        const detail = data?.detail
        if (typeof detail === 'string') throw new Error(detail)
        if (Array.isArray(detail)) throw new Error(detail.map(d => d.msg).join('. '))
        throw new Error('Authentication failed')
      }
      saveToken(data.access_token)
      navigate('/analyze')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError(null)
    setFieldErrors({})
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">AcuTrace</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-3">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 text-xs">Party Ledger & Fund Flow Intelligence</span>
          </div>
          <p className="text-white/50 text-sm">
            {mode === 'login' ? 'Sign in to continue' : 'Create an account to get started'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Tab toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setFieldErrors({}); setPassword('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setFieldErrors(p => ({ ...p, username: '' })) }}
                  placeholder="your_username"
                  autoComplete="username"
                  className={`w-full bg-white/10 border ${
                    fieldErrors.username ? 'border-rose-500/60' : 'border-white/10'
                  } rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/60 text-sm transition-colors`}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-rose-400 text-xs mt-1">{fieldErrors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })) }}
                  placeholder={mode === 'register' ? 'Min 8 chars, 1 uppercase, 1 digit' : 'Your password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className={`w-full bg-white/10 border ${
                    fieldErrors.password ? 'border-rose-500/60' : 'border-white/10'
                  } rounded-xl pl-11 pr-11 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/60 text-sm transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-rose-400 text-xs mt-1">{fieldErrors.password}</p>
              )}
              {mode === 'register' && !fieldErrors.password && (
                <p className="text-white/30 text-xs mt-1">Min 8 chars · 1 uppercase · 1 digit</p>
              )}
            </div>

            {/* Global error */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <p className="text-rose-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={switchMode} className="text-emerald-400 hover:text-emerald-300 transition-colors">
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          Developed by{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent font-medium">
            Shourya Pandey
          </span>
        </p>
      </div>
    </div>
  )
}
