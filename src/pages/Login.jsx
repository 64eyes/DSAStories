import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle } from '../services/firebase'
import { Loader2 } from 'lucide-react'

function Login() {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl sm:p-8">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Authentication Required</h1>
            <p className="text-xs text-neutral-400 sm:text-sm">
              Sync your progress. Save your Elo. Join the leaderboard.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors active:scale-95 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-4 sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin sm:w-[18px]" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <span>Sign in with Google</span>
              )}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 sm:text-sm">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

