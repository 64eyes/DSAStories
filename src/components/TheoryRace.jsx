import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { submitTheoryAnswer } from '../services/multiplayer'
import { getRandomQuestions } from '../data/theoryQuestions'

const DEFAULT_WINNING_SCORE = 10

function TheoryRace({ roomId, roomData, onWinner }) {
  const { currentUser } = useAuth()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null)
  const [playerScores, setPlayerScores] = useState({})
  const [endTime, setEndTime] = useState(null) // End timestamp for current question
  const [timeRemaining, setTimeRemaining] = useState(30) // Display value (calculated from endTime)

  // Get win condition from room data (set during startMatch) or use default
  const winCondition = roomData?.winCondition || DEFAULT_WINNING_SCORE

  // Initialize questions on mount
  useEffect(() => {
    if (roomData?.matchType === 'theory' && roomData?.currentProblemId) {
      const category = roomData.currentProblemId // e.g., 'cpp-foundations'
      const questionSet = getRandomQuestions(category, 20) // Get 20 questions
      setQuestions(questionSet)
    }
  }, [roomData])

  // Ref to track if timeout was handled (prevents multiple submissions)
  const timeoutHandledRef = useRef(false)

  // handleAnswerSelect callback (defined before timer useEffect to avoid dependency issues)
  const handleAnswerSelect = useCallback(async (answerIndex, isTimeout = false) => {
    if (isSubmitting || showFeedback) return

    const question = questions[currentQuestionIndex]
    if (!question) return

    setIsSubmitting(true)
    setSelectedAnswer(answerIndex)
    setCorrectAnswerIndex(question.correct)
    setShowFeedback(true)
    setEndTime(null) // Stop the timer
    timeoutHandledRef.current = true // Mark timeout as handled

    const isCorrect = answerIndex === question.correct

    // Submit answer to Firebase
    if (roomId && currentUser?.uid) {
      try {
        await submitTheoryAnswer(
          roomId,
          currentUser.uid,
          question.id,
          answerIndex !== null ? answerIndex : -1,
          isCorrect,
        )
      } catch (error) {
        console.error('Failed to submit answer:', error)
      }
    }

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setCorrectAnswerIndex(null)
        timeoutHandledRef.current = false // Reset for next question
        // endTime will be reset by the useEffect when currentQuestionIndex changes
      }
      setIsSubmitting(false)
    }, 2000)
  }, [isSubmitting, showFeedback, questions, currentQuestionIndex, roomId, currentUser])

  // Update player scores from room data and check for winner
  useEffect(() => {
    if (roomData?.players) {
      const scores = {}
      Object.entries(roomData.players).forEach(([uid, player]) => {
        scores[uid] = player.correctAnswers || 0
      })
      setPlayerScores(scores)

      // Sort players by score (descending) then by lastCorrectAt (ascending - earlier wins)
      const sortedPlayers = Object.entries(roomData.players)
        .map(([uid, player]) => ({
          uid,
          ...player,
          score: player.correctAnswers || 0,
          lastCorrectAt: player.lastCorrectAt || Infinity, // Use Infinity if no timestamp
        }))
        .sort((a, b) => {
          // Primary sort: highest score first
          if (b.score !== a.score) {
            return b.score - a.score
          }
          // Secondary sort: earliest timestamp first (tie-breaker)
          return a.lastCorrectAt - b.lastCorrectAt
        })

      // Check for winner: only the top player (after tie-breaking) can win
      if (sortedPlayers.length > 0) {
        const topPlayer = sortedPlayers[0]
        if (topPlayer.score >= winCondition && !showFeedback) {
          onWinner({ uid: topPlayer.uid, ...topPlayer })
        }
      }
    }
  }, [roomData, onWinner, showFeedback, winCondition])

  // Timer: Set endTime when question changes
  useEffect(() => {
    if (currentQuestionIndex < questions.length && !showFeedback) {
      // Set end time to 30 seconds from now
      const end = Date.now() + 30000
      setEndTime(end)
      timeoutHandledRef.current = false // Reset timeout flag for new question
    }
  }, [currentQuestionIndex, questions.length, showFeedback])

  // Timer: Update display based on endTime (prevents pausing when tab is hidden)
  useEffect(() => {
    if (endTime && !showFeedback && currentQuestionIndex < questions.length) {
      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000))
        setTimeRemaining(remaining)

        if (remaining <= 0 && !timeoutHandledRef.current) {
          // Time's up - auto-submit wrong answer (only once per question)
          timeoutHandledRef.current = true
          handleAnswerSelect(null, true)
        }
      }

      // Update immediately
      updateTimer()

      // Then update every 100ms for smooth countdown
      const timer = setInterval(updateTimer, 100)

      return () => clearInterval(timer)
    }
  }, [endTime, showFeedback, currentQuestionIndex, questions.length, handleAnswerSelect])
    if (isSubmitting || showFeedback) return

    const question = questions[currentQuestionIndex]
    if (!question) return

    setIsSubmitting(true)
    setSelectedAnswer(answerIndex)
    setCorrectAnswerIndex(question.correct)
    setShowFeedback(true)

    const isCorrect = answerIndex === question.correct

    // Submit answer to Firebase
    if (roomId && currentUser?.uid) {
      try {
        await submitTheoryAnswer(
          roomId,
          currentUser.uid,
          question.id,
          answerIndex !== null ? answerIndex : -1,
          isCorrect,
        )
      } catch (error) {
        console.error('Failed to submit answer:', error)
      }
    }

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setCorrectAnswerIndex(null)
        // endTime will be reset by the useEffect when currentQuestionIndex changes
      }
      setIsSubmitting(false)
    }, 2000)
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-neutral-400">Loading questions...</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const myScore = playerScores[currentUser?.uid] || 0

  return (
    <div className="flex h-full flex-col bg-neutral-950 text-white">
      {/* Header with Score and Timer */}
      <div className="border-b border-white/10 bg-neutral-900/60 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6">
            <div>
              <div className="text-xs text-neutral-400">Your Score</div>
              <div className="text-xl font-bold text-emerald-400 sm:text-2xl">{myScore} / {winCondition}</div>
            </div>
            <div className="hidden h-12 w-px bg-white/10 sm:block" />
            <div className="hidden sm:block">
              <div className="text-xs text-neutral-400">Question</div>
              <div className="text-lg font-semibold text-white">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-yellow-500 sm:w-5" />
            <span className={`text-lg font-mono font-bold sm:text-xl ${timeRemaining <= 10 ? 'text-red-500' : 'text-white'}`}>
              {timeRemaining}s
            </span>
          </div>
        </div>
        {/* Mobile Question Counter */}
        <div className="mt-2 text-xs text-neutral-400 sm:hidden">
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-white sm:mb-6 sm:text-2xl">{currentQuestion.question}</h2>

            <div className="space-y-2 sm:space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === correctAnswerIndex
                const showResult = showFeedback

                let buttonClass = 'w-full rounded-lg border p-3 text-left transition-all active:scale-95 sm:p-4'
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += ' border-emerald-500 bg-emerald-900/30 text-emerald-300'
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ' border-red-500 bg-red-900/30 text-red-300'
                  } else {
                    buttonClass += ' border-neutral-700 bg-neutral-800/50 text-neutral-400'
                  }
                } else {
                  buttonClass += isSelected
                    ? ' border-blue-500 bg-blue-900/30 text-blue-300'
                    : ' border-neutral-700 bg-neutral-800/50 text-white hover:border-neutral-600 hover:bg-neutral-800'
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswerSelect(index)}
                    disabled={showFeedback || isSubmitting}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium sm:text-base">{option}</span>
                      {showResult && (
                        <>
                          {isCorrect && <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500 sm:w-5" />}
                          {isSelected && !isCorrect && <XCircle size={18} className="flex-shrink-0 text-red-500 sm:w-5" />}
                        </>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg border p-3 sm:mt-6 sm:p-4"
                style={{
                  borderColor: selectedAnswer === correctAnswerIndex ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                  backgroundColor: selectedAnswer === correctAnswerIndex ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <p className={`text-sm font-semibold sm:text-base ${selectedAnswer === correctAnswerIndex ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedAnswer === correctAnswerIndex ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="mt-2 text-xs text-neutral-300 sm:text-sm">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="w-full border-t border-white/10 bg-neutral-900/30 p-4 lg:w-80 lg:border-l lg:border-t-0">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:mb-4 sm:text-sm">
          Leaderboard
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:space-y-2 lg:grid-cols-1">
          {(() => {
            // Sort players with tie-breaking: score (desc) then lastCorrectAt (asc)
            const sortedPlayers = Object.entries(roomData?.players || {})
              .map(([uid, player]) => ({
                uid,
                ...player,
                score: player.correctAnswers || 0,
                lastCorrectAt: player.lastCorrectAt || Infinity,
              }))
              .sort((a, b) => {
                // Primary sort: highest score first
                if (b.score !== a.score) {
                  return b.score - a.score
                }
                // Secondary sort: earliest timestamp first (tie-breaker)
                return a.lastCorrectAt - b.lastCorrectAt
              })

            return sortedPlayers.map((player, index) => {
              const isMe = player.uid === currentUser?.uid
              // Only the top player (index 0) who has reached winCondition is the winner
              const isWinner = index === 0 && player.score >= winCondition

              return (
                <div
                  key={player.uid}
                  className={`rounded-lg border p-2 sm:p-3 ${
                    isWinner
                      ? 'border-yellow-500 bg-yellow-900/20'
                      : isMe
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-neutral-800 bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                      <span className="text-xs font-bold text-neutral-400">#{index + 1}</span>
                      <img
                        src={player.photoURL || '/default-avatar.png'}
                        alt={player.displayName || 'Player'}
                        className="h-6 w-6 flex-shrink-0 rounded-full border border-neutral-700 object-cover sm:h-8 sm:w-8"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            player.displayName || 'Player',
                          )}&background=dc2626&color=fff&size=32`
                        }}
                      />
                      <span className="truncate text-xs font-semibold text-white sm:text-sm">
                        <span className="hidden sm:inline">{player.displayName || 'Anonymous'}</span>
                        <span className="sm:hidden">{player.displayName?.split(' ')[0] || 'Anon'}</span>
                        {isMe && <span className="hidden sm:inline"> (You)</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {isWinner && <Trophy size={14} className="flex-shrink-0 text-yellow-500 sm:w-4" />}
                      <span className={`text-sm font-bold sm:text-base ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                        {player.score}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          })()}
        </div>
      </div>
    </div>
  )
}

export default TheoryRace

