/**
 * EloAnimation Component
 * Displays animated Elo rating change (e.g., "Elo: 1200 -> 1230 (+30)")
 */

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

function EloAnimation({ oldElo, newElo, ratingChange }) {
  const [displayElo, setDisplayElo] = useState(oldElo)

  // Animate from oldElo to newElo
  useEffect(() => {
    if (oldElo === null || newElo === null) return

    let startTime = null
    const duration = 1000 // 1 second animation
    const startValue = oldElo
    const endValue = newElo
    const difference = endValue - startValue

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(startValue + difference * easedProgress)
      setDisplayElo(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayElo(endValue) // Ensure we end at exact value
      }
    }

    requestAnimationFrame(animate)
  }, [oldElo, newElo])

  if (oldElo === null || newElo === null || ratingChange === null) {
    return null
  }

  const isPositive = ratingChange > 0
  const changeColor = isPositive ? 'text-emerald-400' : 'text-red-400'
  const changeSymbol = isPositive ? '+' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex items-center justify-center gap-2 text-xl"
    >
      <span className="text-neutral-300">Elo:</span>
      <span className="font-mono font-semibold text-white">{oldElo}</span>
      <span className="text-neutral-500">→</span>
      <motion.span
        key={displayElo}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="font-mono font-bold text-white"
      >
        {displayElo}
      </motion.span>
      <span className={`font-mono font-semibold ${changeColor}`}>
        ({changeSymbol}{ratingChange})
      </span>
    </motion.div>
  )
}

export default EloAnimation

