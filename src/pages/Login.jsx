import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithGoogle,
  signUpWithEmailPassword,
  signInWithEmailPassword,
} from '../services/firebase'
import { Loader2 } from 'lucide-react'

function Login() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
      navigate('/campaign')
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        await signUpWithEmailPassword(email.trim(), password)
      } else {
        await signInWithEmailPassword(email.trim(), password)
      }
      navigate('/campaign')
    } catch (err) {
      setError(err.message || `Failed to ${mode === 'signup' ? 'sign up' : 'sign in'}`)
      setIsLoading(false)
    }
  }

  const isEmailDisabled = isLoading

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-neutral-400 sm:text-sm">
              Sync your progress. Save your Elo. Join the leaderboard.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-full bg-neutral-800 p-1 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailDisabled}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isEmailDisabled}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors active:scale-95 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3.5 sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin sm:w-[18px]" />
                  <span>{mode === 'signup' ? 'Creating account...' : 'Signing in...'}</span>
                </span>
              ) : (
                <span>{mode === 'signup' ? 'Sign Up with Email' : 'Log In with Email'}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <div className="h-px flex-1 bg-neutral-800" />
            <span>or</span>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          {/* Google Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors active:scale-95 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3.5 sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin sm:w-[18px]" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <span>Continue with Google</span>
              )}
            </button>
          </div>

          {error && <p className="text-xs text-red-400 sm:text-sm">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default Login

