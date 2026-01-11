import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

/**
 * NotificationToast - Transient notification component for user feedback
 * @param {boolean} isOpen - Whether the toast is visible
 * @param {Function} onClose - Callback when toast should close
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Auto-close duration in ms (default: 3000, 0 = don't auto-close)
 */
function NotificationToast({ isOpen, onClose, message, type = 'info', duration = 3000 }) {
  // Auto-close after duration
  useEffect(() => {
    if (!isOpen || duration === 0) return

    const timer = setTimeout(() => {
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [isOpen, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-emerald-400" />
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />
      default:
        return <Info size={20} className="text-blue-400" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-900/20'
      case 'error':
        return 'border-red-500/30 bg-red-900/20'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-900/20'
      default:
        return 'border-blue-500/30 bg-blue-900/20'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed top-4 left-1/2 z-50 flex items-center gap-3 rounded-lg border ${getStyles()} p-4 shadow-xl backdrop-blur-sm`}
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="flex-shrink-0">{getIcon()}</div>
          <p className="text-sm font-medium text-white">{message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded p-1 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationToast
