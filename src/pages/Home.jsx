import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import CodeRain from '../components/CodeRain'

const chaosSymbols = ['*ptr', '&ref', 'malloc()', 'free()', 'segfault', 'new', 'delete', 'nullptr']
const chaosBadges = ['O(n)', 'O(log n)', 'O(n^2)', 'void*', 'nullptr', 'delete[]', 'malloc', 'free', 'stack', 'heap', 'ptr', '&ref', 'O(1)', 'O(n log n)', 'segfault']

const featureCards = [
  {
    title: 'The Campaign',
    subtitle: '7 Regions. No Skips.',
    body: 'Advance through The Genesis to The Grandmaster. Unlock narratives while mastering memory-safe C++.',
  },
  {
    title: 'The Arena',
    subtitle: '1v1 Debug Duels.',
    body: 'Real-time lobbies, focus checks, paste guard, and keystroke replays. Latency target: <100ms.',
  },
  {
    title: 'The Hall of Fame',
    subtitle: 'Global Elo Ranking.',
    body: 'Climb weekly and national leaderboards. Earn badges from campaign clears and arena streaks.',
  },
]

const getGridPosition = (index) => {
  const cols = 4
  const spacingX = 140
  const spacingY = 80
  const col = index % cols
  const row = Math.floor(index / cols)
  return {
    x: (col - (cols - 1) / 2) * spacingX,
    y: (row - 1) * spacingY,
  }
}

function Home() {
  const [ordered, setOrdered] = useState(false)

  const floatingSymbols = useMemo(
    () =>
      chaosSymbols.map((symbol, idx) => ({
        id: `${symbol}-${idx}`,
        symbol,
        x: Math.random() * 520 - 260,
        y: Math.random() * 360 - 180,
        rotate: Math.random() * 40 - 20,
        delay: Math.random() * 0.6,
      })),
    [],
  )

  const floatingBadges = useMemo(
    () =>
      chaosBadges.map((label, idx) => ({
        id: `${label}-${idx}`,
        label,
        x: Math.random() * 640 - 320,
        y: Math.random() * 420 - 210,
        rotate: Math.random() * 20 - 10,
        delay: Math.random() * 0.4,
      })),
    [],
  )

  const getBadgeGridPosition = (index) => {
    const cols = 5
    const spacingX = 140
    const spacingY = 90
    const col = index % cols
    const row = Math.floor(index / cols)
    return {
      x: (col - (cols - 1) / 2) * spacingX,
      y: (row - 1) * spacingY,
    }
  }

  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-neutral-950 px-4 pb-16 pt-10 sm:px-6 lg:px-10 lg:pt-14">
      <CodeRain opacity={0.16} />
      {/* depth gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-red-700/10 blur-3xl" />
      </div>

      {/* chaos → order badges */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {floatingBadges.map((item, idx) => {
          const grid = getBadgeGridPosition(idx)
          return (
            <motion.div
              key={item.id}
              className="absolute left-1/2 top-1/2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-100/80 shadow-[0_0_25px_rgba(239,68,68,0.15)] backdrop-blur-sm"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={
                ordered
                  ? {
                      x: grid.x,
                      y: grid.y,
                      rotate: 0,
                      scale: 1,
                      opacity: 0.4,
                    }
                  : {
                      x: item.x,
                      y: item.y,
                      rotate: item.rotate,
                      scale: 0.9,
                      opacity: 0.22,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 18,
                mass: 0.9,
                delay: item.delay,
              }}
            >
              {item.label}
            </motion.div>
          )
        })}
      </div>

      {/* floating chaos symbols */}
      <div className="pointer-events-none absolute inset-0">
        {floatingSymbols.map((item, idx) => {
          const grid = getGridPosition(idx)
          return (
            <motion.span
              key={item.id}
              className="absolute left-1/2 top-1/2 text-sm font-semibold uppercase tracking-widest text-red-200/60"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={
                ordered
                  ? { x: grid.x, y: grid.y, opacity: 0.9, rotate: 0, scale: 1 }
                  : {
                      x: item.x,
                      y: item.y,
                      opacity: 0.35,
                      rotate: item.rotate,
                      scale: 0.9,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 16,
                mass: 0.8,
                delay: item.delay,
              }}
            >
              {item.symbol}
            </motion.span>
          )
        })}
      </div>

      <div className="relative mx-auto max-w-5xl space-y-12">
        <motion.div
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-red-300/80">
            Segmentation Fault → Sorted Array
          </p>
          <h1 className="text-balance text-4xl font-black leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Turn Your Struggle into a Story.
          </h1>
          <p className="text-lg text-gray-300 sm:text-xl">
            The Multiplayer Battleground for Data Structures & Algorithms.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <motion.a
              href="/campaign"
              className="group relative w-full max-w-xs overflow-hidden rounded-xl bg-red-600 px-6 py-4 text-center text-lg font-semibold text-white shadow-[0_0_30px_rgba(220,38,38,0.45)] transition duration-200 hover:shadow-[0_0_40px_rgba(220,38,38,0.55)]"
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setOrdered(true)}
              onMouseLeave={() => setOrdered(false)}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Start The Campaign</span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-500/40 to-red-700/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </motion.a>

            <motion.a
              href="/lobby"
              aria-label="Enter Arena - Quick Match"
              className="group w-full max-w-xs rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-center text-lg font-semibold text-white transition duration-200 hover:border-red-400/50 hover:bg-white/10"
              onMouseEnter={() => setOrdered(true)}
              onMouseLeave={() => setOrdered(false)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Quick Match</span>
                <ArrowRight size={18} className="text-red-300" />
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-red-300/80">
                Enter Lobby
              </p>
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
        >
          {featureCards.map((card, idx) => (
            <motion.div
              key={card.title}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg"
              whileHover={{
                y: -6,
                rotateX: -2,
                rotateY: 2,
                boxShadow: '0 15px 45px rgba(0,0,0,0.35)',
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-red-500/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              <div className="relative space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-red-300/80">
                  {card.subtitle}
                </p>
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-gray-300">{card.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Home

