import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { Check, Trophy } from 'lucide-react'

/**
 * LevelCompleteModal
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onNext: () => void
 * - isSaving?: boolean
 * - saveError?: string | null
 * - progressSaved?: boolean
 * - xpGained?: number (default 50)
 * - isGuest?: boolean (default false)
 */
function LevelCompleteModal({
  isOpen,
  onClose,
  onNext,
  isSaving = false,
  saveError = null,
  progressSaved = false,
  xpGained = 50,
  isGuest = false,
}) {
  const navigate = useNavigate()
  const [displayXp, setDisplayXp] = useState(0)

  // Animate XP count-up when modal opens
  useEffect(() => {
    if (!isOpen) {
      setDisplayXp(0)
      return
    }

    let current = 0
    const duration = 600 // ms
    const steps = 20
    const increment = xpGained / steps
    const interval = duration / steps

    const timer = setInterval(() => {
      current += increment
      if (current >= xpGained) {
        setDisplayXp(xpGained)
        clearInterval(timer)
      } else {
        setDisplayXp(Math.round(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isOpen, xpGained])

  // Analytics: Log guest level completion
  useEffect(() => {
    if (isOpen && isGuest) {
      console.log('[Analytics] Guest user completed a level')
    }
  }, [isOpen, isGuest])

  // Placeholder: play success sound here when modal opens
  // useEffect(() => {
  //   if (isOpen) {
  //     // playSuccessSound()
  //   }
  // }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti overlay */}
          <Confetti
            recycle={false}
            numberOfPieces={250}
            gravity={0.6}
            tweenDuration={500}
          />

          {/* Modal Overlay */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-emerald-500/50 bg-neutral-900 p-8 text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600">
                <Trophy size={32} className="text-white" />
              </div>

              <h2 className="mb-1 text-xl font-semibold text-emerald-400">
                Systems Operational
              </h2>
              <p className="mb-6 text-sm text-neutral-400">
                Sector secured. All checks passed.
              </p>

              {/* Stats */}
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-4 py-2">
                  <Check size={16} className="text-emerald-400" />
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      XP Gained
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      +{displayXp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Mode Warning */}
              {isGuest && (
                <div className="mb-4 rounded-lg border border-yellow-500/50 bg-yellow-900/30 p-3 text-sm text-yellow-300">
                  Your progress will be lost if you leave.
                </div>
              )}

              {/* Saving Progress Indicator */}
              {isSaving && (
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-neutral-400">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  <span>Saving progress...</span>
                </div>
              )}

              {/* Save Error */}
              {saveError && (
                <div className="mb-4 rounded-lg border border-red-500/50 bg-red-900/30 p-3 text-sm text-red-400">
                  {saveError}
                </div>
              )}

              {/* Progress Saved Success Message */}
              {progressSaved && !isSaving && !isGuest && (
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-emerald-400">
                  <Check size={16} />
                  <span>Progress saved!</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
                >
                  Stay in Sector
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isGuest) {
                      navigate('/login')
                    } else {
                      onNext()
                    }
                  }}
                  disabled={isSaving}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                    isSaving
                      ? 'bg-neutral-700 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isGuest ? 'Login to Save Progress' : isSaving ? 'Saving...' : 'Next Chapter'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default LevelCompleteModal


