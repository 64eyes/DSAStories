import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, X, Sparkles, Check, ChevronRight, BookOpen, ExternalLink } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import LevelCompleteModal from '../components/LevelCompleteModal'
import { CHAPTER_CONTENT } from '../data/chapterContent'
import { useAuth } from '../contexts/AuthContext'
import { unlockChapter, getUserProgress } from '../services/progress'

// Region data to check region completion
const REGIONS = [
  { id: 1, chapterIds: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '1-9', '1-10', '1-11', '1-12', '1-13', '1-14', '1-15', '1-16', '1-17', '1-18', '1-19', '1-20'], title: 'The Genesis' },
  { id: 2, chapterIds: ['2-1', '2-2', '2-3', '2-4'], title: 'The Architect' },
  { id: 3, chapterIds: ['3-1', '3-2', '3-3', '3-4'], title: 'The Search & Sort Library' },
  { id: 4, chapterIds: ['4-1', '4-2', '4-3', '4-4'], title: 'The Vault' },
  { id: 5, chapterIds: ['5-1', '5-2', '5-3', '5-4'], title: 'The Forest' },
  { id: 6, chapterIds: ['6-1', '6-2', '6-3', '6-4'], title: 'The Web' },
  { id: 7, chapterIds: ['7-1', '7-2', '7-3', '7-4', '7-5'], title: 'The Grandmaster' },
]

// Helper to get region ID from chapter ID
function getRegionId(chapterId) {
  const regionId = parseInt(chapterId.split('-')[0])
  return regionId
}

function ChapterPlay() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const chapter = CHAPTER_CONTENT[chapterId]
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showWrongAnswer, setShowWrongAnswer] = useState(false)
  const [outputDiff, setOutputDiff] = useState({ expected: '', actual: '' })
  const [showMemoryProtocolError, setShowMemoryProtocolError] = useState(false)
  const [missingSyntax, setMissingSyntax] = useState([])
  const [newRegionUnlocked, setNewRegionUnlocked] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [progressSaved, setProgressSaved] = useState(false)
  const [isChapterCompleted, setIsChapterCompleted] = useState(false)
  const [isCheckingProgress, setIsCheckingProgress] = useState(true)

  // Check if chapter is already completed on mount
  useEffect(() => {
    const checkCompletion = async () => {
      if (!currentUser?.uid || !chapterId) {
        setIsCheckingProgress(false)
        return
      }

      try {
        const progress = await getUserProgress(currentUser.uid)
        const isCompleted = progress.unlockedChapters.includes(chapterId)
        setIsChapterCompleted(isCompleted)
      } catch (error) {
        console.error('Failed to check chapter completion:', error)
      } finally {
        setIsCheckingProgress(false)
      }
    }

    checkCompletion()
  }, [chapterId, currentUser])

  // Check if user is entering a new region for the first time
  useEffect(() => {
    const checkNewRegion = async () => {
      if (!currentUser?.uid || !chapterId) return

      try {
        const progress = await getUserProgress(currentUser.uid)
        const currentRegionId = getRegionId(chapterId)
        const currentRegion = REGIONS.find((r) => r.id === currentRegionId)

        if (currentRegion && currentRegionId > 1) {
          // Check if this is the first chapter in this region that the user is accessing
          const isFirstChapterInRegion = chapterId === currentRegion.chapterIds[0]
          const hasAnyChapterInRegion = currentRegion.chapterIds.some((id) =>
            progress.unlockedChapters.includes(id),
          )

          // If this is the first chapter and user hasn't completed any chapter in this region yet
          // (meaning they just unlocked it), show notification
          if (isFirstChapterInRegion && !hasAnyChapterInRegion) {
            // Check if previous region is completed
            const prevRegion = REGIONS.find((r) => r.id === currentRegionId - 1)
            if (prevRegion) {
              const prevRegionCompleted = prevRegion.chapterIds.every((id) =>
                progress.unlockedChapters.includes(id),
              )
              if (prevRegionCompleted) {
                // Show notification that this region is now accessible
                setNewRegionUnlocked(currentRegion)
                setTimeout(() => setNewRegionUnlocked(null), 5000)
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to check region status:', error)
      }
    }

    checkNewRegion()
  }, [chapterId, currentUser])

  if (!chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Chapter Not Found</h1>
          <p className="text-neutral-400 mb-6">The chapter "{chapterId}" does not exist.</p>
          <button
            onClick={() => navigate('/campaign')}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
          >
            Back to Campaign Map
          </button>
        </div>
      </div>
    )
  }

  const difficultyColors = {
    Novice: 'bg-emerald-600',
    Engineer: 'bg-blue-600',
    Grandmaster: 'bg-red-600',
  }

  const handleCodeSuccess = async (actualOutput, sourceCode = '') => {
    if (!chapter.expectedOutput) {
      // No expected output defined, skip verification
      return
    }

    // Check for required syntax first (if defined)
    if (chapter.requiredSyntax && Array.isArray(chapter.requiredSyntax) && sourceCode) {
      const missing = chapter.requiredSyntax.filter((keyword) => {
        // Case-insensitive search for the keyword in source code
        // Use word boundary regex to avoid partial matches
        const regex = new RegExp(`\\b${keyword}\\b`, 'i')
        return !regex.test(sourceCode)
      })

      if (missing.length > 0) {
        // Output might be correct, but syntax is missing
        setMissingSyntax(missing)
        setShowMemoryProtocolError(true)
        // Auto-hide after 5 seconds
        setTimeout(() => setShowMemoryProtocolError(false), 5000)
        return // Don't proceed with success flow
      }
    }

    const expected = chapter.expectedOutput.trim()
    const actual = actualOutput.trim()

    if (expected === actual) {
      // Correct answer!
      setSaveError(null)
      setProgressSaved(false)

      // Check if user is logged in
      if (currentUser && currentUser.uid) {
        // Logged in user - save progress
        setIsSaving(true)
        try {
          await unlockChapter(currentUser.uid, chapterId)
          setIsChapterCompleted(true) // Mark as completed locally

          // Check if this completes a region and unlocks the next one
          const progress = await getUserProgress(currentUser.uid)
          const currentRegionId = getRegionId(chapterId)
          const currentRegion = REGIONS.find((r) => r.id === currentRegionId)

          if (currentRegion) {
            // Check if all chapters in current region are completed
            const allCompleted = currentRegion.chapterIds.every((id) =>
              progress.unlockedChapters.includes(id),
            )

            if (allCompleted && currentRegionId < REGIONS.length) {
              // Region completed! Next region is unlocked
              const nextRegion = REGIONS.find((r) => r.id === currentRegionId + 1)
              if (nextRegion) {
                setNewRegionUnlocked(nextRegion)
              }
            }
          }

          setProgressSaved(true)
        } catch (error) {
          console.error('Failed to save progress:', error)
          setSaveError(error.message || 'Failed to save progress')
        } finally {
          setIsSaving(false)
        }
      } else {
        // Guest user - don't save progress, but still show success
        setIsChapterCompleted(true) // Mark as completed locally for this session
      }

      setShowSuccessModal(true)
    } else {
      // Wrong answer - show diff
      setOutputDiff({ expected, actual })
      setShowWrongAnswer(true)
      // Auto-hide after 5 seconds
      setTimeout(() => setShowWrongAnswer(false), 5000)
    }
  }

  const handleNextChapter = () => {
    // Close the success modal before navigating
    setShowSuccessModal(false)

    if (chapter.nextChapterId) {
      navigate(`/campaign/${chapter.nextChapterId}`)
    } else {
      navigate('/campaign')
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-neutral-950/60 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/campaign')}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:border-white/25 hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            <span>Back to Map</span>
          </button>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-white">{chapter.title}</h1>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    difficultyColors[chapter.difficulty] || 'bg-neutral-600'
                  }`}
                >
                  {chapter.difficulty}
                </span>
                {isChapterCompleted && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    <Check size={12} />
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {isChapterCompleted && chapter.nextChapterId && (
          <button
            onClick={handleNextChapter}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <span>Next Chapter</span>
            <ChevronRight size={16} />
          </button>
        )}
      </header>

      {/* Split Screen Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Story */}
        <div className="w-full overflow-y-auto border-r border-white/10 bg-neutral-900/30 p-6 lg:w-2/5">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Story Content */}
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">
                {chapter.story.split('\n').map((line, idx) => {
                  // Simple markdown-like rendering
                  if (line.startsWith('# ')) {
                    return (
                      <h1 key={idx} className="mb-4 text-2xl font-bold text-white">
                        {line.substring(2)}
                      </h1>
                    )
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <strong key={idx} className="font-semibold text-white">
                        {line.slice(2, -2)}
                      </strong>
                    )
                  }
                  if (line.trim() === '') {
                    return <br key={idx} />
                  }
                  return (
                    <p key={idx} className="mb-3">
                      {line.split('**').map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="font-semibold text-white">
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Objective Box */}
            <div className="rounded-lg border border-red-600/50 bg-red-600/10 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400">
                Objective
              </h3>
              <p className="text-sm text-white">{chapter.objective}</p>
            </div>

            {/* Field Manual / Resources */}
            {chapter.resources && chapter.resources.length > 0 && (
              <div className="rounded-lg border border-blue-600/30 bg-blue-600/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Field Manual
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {chapter.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 rounded-md border border-blue-600/20 bg-neutral-800/60 px-3 py-1.5 text-xs text-blue-300 transition-colors hover:border-blue-600/40 hover:bg-neutral-800/80 hover:text-blue-200"
                    >
                      <span>{resource.title}</span>
                      <ExternalLink size={12} className="opacity-60 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 overflow-hidden bg-neutral-950">
          <CodeEditorWithStarterCode
            starterCode={chapter.starterCode}
            onSuccess={handleCodeSuccess}
          />
        </div>
      </div>

      {/* Success Modal */}
      <LevelCompleteModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onNext={handleNextChapter}
        isSaving={isSaving}
        saveError={saveError}
        progressSaved={progressSaved}
        xpGained={50}
        isGuest={!currentUser}
      />

      {/* New Region Unlocked Notification */}
      <AnimatePresence>
        {newRegionUnlocked && (
          <motion.div
            className="fixed top-6 left-1/2 z-50 -translate-x-1/2"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-neutral-900 px-6 py-4 shadow-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-400">New Region Unlocked!</p>
                <p className="text-xs text-neutral-300">
                  {newRegionUnlocked.title} is now available
                </p>
              </div>
              <button
                onClick={() => setNewRegionUnlocked(null)}
                className="ml-4 rounded-md px-2 py-1 text-xs text-neutral-400 transition hover:text-white"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Protocol Error Toast */}
      <AnimatePresence>
        {showMemoryProtocolError && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="w-96 rounded-lg border border-yellow-500/50 bg-neutral-900 p-4 shadow-2xl">
              <div className="mb-3 flex items-center gap-2">
                <X size={20} className="text-yellow-500" />
                <h3 className="font-semibold text-yellow-400">Memory Protocol Violation</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-yellow-300">
                  Output correct, but you failed the Memory Protocol.
                </p>
                {missingSyntax.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Missing Required Syntax:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingSyntax.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-yellow-900/30 px-2 py-1 font-mono text-xs text-yellow-300"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-yellow-300/80">
                      Did you use {missingSyntax.map((k) => `'${k}'`).join(' and ')}?
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wrong Answer Toast */}
      <AnimatePresence>
        {showWrongAnswer && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="w-96 rounded-lg border border-red-500/50 bg-neutral-900 p-4 shadow-2xl">
              <div className="mb-3 flex items-center gap-2">
                <X size={20} className="text-red-500" />
                <h3 className="font-semibold text-red-400">Wrong Answer</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Expected:
                  </p>
                  <pre className="rounded bg-emerald-900/30 p-2 font-mono text-xs text-emerald-300 whitespace-pre-wrap">
                    {outputDiff.expected || '(empty)'}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Your Output:
                  </p>
                  <pre className="rounded bg-red-900/30 p-2 font-mono text-xs text-red-300 whitespace-pre-wrap">
                    {outputDiff.actual || '(empty)'}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Wrapper component to pass starterCode to CodeEditor
function CodeEditorWithStarterCode({ starterCode, onSuccess }) {
  return <CodeEditor initialCode={starterCode} onSuccess={onSuccess} />
}

export default ChapterPlay

