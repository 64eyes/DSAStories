import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

/**
 * ConfirmModal - Custom dark mode confirmation modal to replace window.confirm
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - Modal title
 * @param {string} message - Modal message/description
 * @param {Function} onConfirm - Callback when user confirms
 * @param {Function} onCancel - Callback when user cancels
 * @param {string} variant - Variant type: 'danger' (red) or 'warning' (yellow)
 * @param {string} confirmText - Text for confirm button (default: 'Confirm')
 * @param {string} cancelText - Text for cancel button (default: 'Cancel')
 */
function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  variant = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-md rounded-xl border ${
                variant === 'danger'
                  ? 'border-red-500/30 bg-neutral-900'
                  : 'border-yellow-500/30 bg-neutral-900'
              } p-6 shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center">
                <div
                  className={`rounded-full p-3 ${
                    variant === 'danger'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  <AlertTriangle size={24} />
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-3 text-center text-xl font-bold text-white">{title}</h2>

              {/* Message */}
              <p className="mb-6 whitespace-pre-line text-center text-sm text-neutral-300">{message}</p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 font-semibold text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-white"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 rounded-lg border px-4 py-2.5 font-semibold text-white transition-colors ${
                    variant === 'danger'
                      ? 'border-red-500/50 bg-red-600 hover:bg-red-700'
                      : 'border-yellow-500/50 bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal
