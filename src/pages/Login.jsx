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
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Authentication Required</h1>
            <p className="text-sm text-neutral-400">
              Sync your progress. Save your Elo. Join the leaderboard.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full rounded-lg bg-white px-6 py-4 text-base font-semibold text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <span>Sign in with Google</span>
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

