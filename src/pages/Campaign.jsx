import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Play, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getUserProgress } from '../services/progress'

// Base region data (status will be calculated dynamically)
const REGIONS_BASE = [
  {
    id: 1,
    title: 'The Genesis',
    subtitle: 'Foundations & Memory',
    position: { x: 50, y: 6 },
    chapters: [
      '1-1: The Boot Sequence',
      '1-2: The Echo (Input/Output)',
      '1-3: The Commenter',
      '1-4: The Formatter',
      '1-5: The Overflow',
      '1-6: The Constant',
      '1-7: The Type Caster',
      '1-8: The Logic Gate',
      '1-9: The Guard (If/Else)',
      '1-10: The Switch',
      '1-11: The While Loop',
      '1-12: The Matrix (Nested)',
      '1-13: The Breakout',
      '1-14: The Blueprint (Functions)',
      '1-15: The Copy (Pass-by-Value)',
      '1-16: The Reference',
      '1-17: The Scope',
      '1-18: The Address (&)',
      '1-19: The Dereference (*)',
      '1-20: The Memory Leak (Boss)',
    ],
    chapterIds: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '1-9', '1-10', '1-11', '1-12', '1-13', '1-14', '1-15', '1-16', '1-17', '1-18', '1-19', '1-20'],
  },
  {
    id: 2,
    title: 'The Architect',
    subtitle: 'Complexity & Big O',
    position: { x: 25, y: 18 },
    chapters: ['Formalisms (Pseudocode)', 'Big O Analysis', 'Recurrence Relationships', 'Iterative vs Recursive'],
    chapterIds: ['2-1', '2-2', '2-3', '2-4'],
  },
  {
    id: 3,
    title: 'The Search & Sort Library',
    subtitle: 'Linear vs Logarithmic',
    position: { x: 75, y: 30 },
    chapters: ['Searching Algorithms', 'Basic Sorts', 'Advanced Sorts', 'Stability & Efficiency'],
    chapterIds: ['3-1', '3-2', '3-3', '3-4'],
  },
  {
    id: 4,
    title: 'The Vault',
    subtitle: 'Abstract Data Types',
    position: { x: 40, y: 43 },
    chapters: ['Encapsulation & Hiding', 'Dynamic Arrays', 'Linked Lists', 'Stacks & Queues'],
    chapterIds: ['4-1', '4-2', '4-3', '4-4'],
  },
  {
    id: 5,
    title: 'The Forest',
    subtitle: 'Trees & Heaps',
    position: { x: 68, y: 56 },
    chapters: ['Binary Search Trees', 'Tree Traversals', 'Red-Black Trees', 'Heaps & Priority Queues'],
    chapterIds: ['5-1', '5-2', '5-3', '5-4'],
  },
  {
    id: 6,
    title: 'The Web',
    subtitle: 'Graphs & Hashing',
    position: { x: 49.9, y: 69 },
    chapters: ['Graph Representations', 'BFS & DFS', 'Dijkstra', 'Hash Tables & Collisions'],
    chapterIds: ['6-1', '6-2', '6-3', '6-4'],
  },
  {
    id: 7,
    title: 'The Grandmaster',
    subtitle: 'Strategies & Correctness',
    position: { x: 55, y: 90 },
    chapters: ['Greedy Algorithms', 'Divide & Conquer', 'Dynamic Programming', 'Formal Verification', 'The Final Exam'],
    chapterIds: ['7-1', '7-2', '7-3', '7-4', '7-5'],
  },
]

const statusStyles = {
  locked: {
    border: 'border-neutral-700',
    text: 'text-neutral-500',
    bg: 'bg-neutral-900/60',
    shadow: 'shadow-none',
    icon: Lock,
    opacity: 'opacity-50',
  },
  active: {
    border: 'border-white',
    text: 'text-white',
    bg: 'bg-neutral-900/80',
    shadow: 'shadow-[0_0_25px_rgba(220,38,38,0.5)]',
    icon: Play,
    opacity: 'opacity-100',
  },
  completed: {
    border: 'border-emerald-500',
    text: 'text-white',
    bg: 'bg-neutral-900/80',
    shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.45)]',
    icon: Check,
    opacity: 'opacity-100',
  },
}

function CampaignNode({ region, onClick, index }) {
  const styles = statusStyles[region.status] || statusStyles.locked
  const Icon = styles.icon

  const isClickable = region.status === 'active' || region.status === 'completed'

  return (
    <motion.button
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-4 py-3 text-left ${styles.bg} ${styles.border} ${styles.shadow} ${styles.opacity} backdrop-blur-md transition duration-200`}
      style={{ left: `${region.position.x}%`, top: `${region.position.y}%` }}
      onClick={() => isClickable && onClick(region)}
      disabled={!isClickable}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 180, damping: 18 }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-sm ${styles.text}`}
        >
          <Icon size={18} />
        </span>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Region {region.id}</p>
          <p className={`text-sm font-semibold leading-tight ${styles.text}`}>{region.title}</p>
          <p className="text-xs text-neutral-500">{region.subtitle}</p>
        </div>
      </div>
    </motion.button>
  )
}

function ChapterModal({ region, onClose, unlockedChapters = [] }) {
  const navigate = useNavigate()

  const handleChapterClick = (chapterIndex) => {
    if (!region) return
    const chapterId = `${region.id}-${chapterIndex + 1}`
    navigate(`/campaign/${chapterId}`)
    onClose()
  }

  const isChapterCompleted = (chapterIndex) => {
    if (!region) return false
    const chapterId = `${region.id}-${chapterIndex + 1}`
    return unlockedChapters.includes(chapterId)
  }

  return (
    <AnimatePresence>
      {region ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6 text-white shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-red-600">Region {region.id}</p>
                <h3 className="text-xl font-semibold text-white">{region.title}</h3>
                <p className="text-sm text-neutral-400">{region.subtitle}</p>
                {unlockedChapters.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>
                        {region.chapterIds.filter((id) => unlockedChapters.includes(id)).length} / {region.chapterIds.length} completed
                      </span>
                    </div>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{
                          width: `${
                            (region.chapterIds.filter((id) => unlockedChapters.includes(id)).length /
                              region.chapterIds.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-md px-2 py-1 text-sm text-neutral-300 transition hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">
              {region.chapters.map((chapter, index) => {
                const completed = isChapterCompleted(index)
                return (
                  <button
                    key={chapter}
                    onClick={() => handleChapterClick(index)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      completed
                        ? 'border-emerald-500/50 bg-emerald-900/20 text-emerald-200 hover:border-emerald-500/70 hover:bg-emerald-900/30'
                        : 'border-white/5 bg-neutral-800/60 text-neutral-200 hover:border-white/20 hover:bg-neutral-700/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{chapter}</span>
                      {completed && (
                        <Check size={16} className="text-emerald-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function Campaign() {
  const { currentUser } = useAuth()
  const location = useLocation()
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [regions, setRegions] = useState(REGIONS_BASE.map((r) => ({ ...r, status: 'locked' })))
  const [unlockedChapters, setUnlockedChapters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user progress on mount and when navigating back to this page
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser?.uid) {
        // Not logged in - set Region 1 as active, rest locked
        setRegions((prev) =>
          prev.map((r, idx) => ({
            ...r,
            status: idx === 0 ? 'active' : 'locked',
          })),
        )
        setIsLoading(false)
        return
      }

      try {
        const progress = await getUserProgress(currentUser.uid)
        setUnlockedChapters(progress.unlockedChapters || [])

        // Calculate region statuses
        const updatedRegions = REGIONS_BASE.map((region, idx) => {
          const regionChapterIds = region.chapterIds
          const completedChapters = regionChapterIds.filter((id) =>
            progress.unlockedChapters.includes(id),
          )
          const allCompleted = completedChapters.length === regionChapterIds.length
          const someCompleted = completedChapters.length > 0

          let status = 'locked'

          if (allCompleted) {
            status = 'completed'
          } else if (someCompleted || idx === 0) {
            // Region 1 is always active, or if any chapter is completed
            status = 'active'
          } else if (idx > 0) {
            // Check if previous region is completed
            const prevRegion = REGIONS_BASE[idx - 1]
            const prevCompleted = prevRegion.chapterIds.every((id) =>
              progress.unlockedChapters.includes(id),
            )
            if (prevCompleted) {
              status = 'active'
            }
          }

          return { ...region, status }
        })

        setRegions(updatedRegions)
      } catch (error) {
        console.error('Failed to fetch progress:', error)
        // Fallback: Region 1 active, rest locked
        setRegions((prev) =>
          prev.map((r, idx) => ({
            ...r,
            status: idx === 0 ? 'active' : 'locked',
          })),
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [currentUser, location.pathname]) // Refresh when navigating back to campaign page

  const lines = useMemo(() => {
    return regions.slice(0, -1).map((region, idx) => [region.position, regions[idx + 1].position])
  }, [regions])

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12">
        <header className="mb-10 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-red-600">Campaign / Constellation</p>
          <h1 className="text-3xl font-bold text-white">Story Mode Map</h1>
          <p className="text-sm text-neutral-400">
            Progress through the regions. Active nodes glow red, completed nodes shine green, and locked nodes stay
            greyed out.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/30 px-4 py-10">
          <div className="relative mx-auto h-[1400px] max-w-4xl">
            {/* svg paths */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {lines.map(([a, b], idx) => (
                <line
                  key={`${a.x}-${a.y}-${b.x}-${b.y}-${idx}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="url(#tech-line)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.95"
                  strokeLinecap="round"
                  filter="url(#tech-glow)"
                />
              ))}
              <defs>
                <linearGradient
                  id="tech-line"
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
                </linearGradient>
                <filter id="tech-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* nodes */}
            {regions.map((region, idx) => (
              <CampaignNode key={region.id} region={region} onClick={setSelectedRegion} index={idx} />
            ))}
          </div>
        </div>
      </div>

      <ChapterModal
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
        unlockedChapters={unlockedChapters}
      />
    </div>
  )
}

export default Campaign

