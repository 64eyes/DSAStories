import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, Trophy, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { submitTheoryAnswer, updatePlayerQuestionIndex } from '../services/multiplayer'
import { calculateRatingChange, updateUserStats } from '../services/rating'
import { getUserProfile } from '../services/firebase'

const DEFAULT_WINNING_SCORE = 10

function TheoryRace({ roomId, roomData, onWinner, isSpectator = false }) {
  const { currentUser } = useAuth()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null)
  const [playerScores, setPlayerScores] = useState({})
  const [targetTime, setTargetTime] = useState(null) // Target timestamp for current question
  const [timeRemaining, setTimeRemaining] = useState(30) // Display value (calculated from targetTime)
  const winnerDeclaredRef = useRef(false) // Track if winner has been declared to prevent multiple calls
  const ratingUpdatedRef = useRef(false) // Track if rating has been updated to prevent multiple updates
  const stateRestoredRef = useRef(false) // Track if state has been restored from Firebase on mount

  // Get win condition from room data (set during startMatch) or use default
  const winCondition = roomData?.winCondition || DEFAULT_WINNING_SCORE

  // Determine if current user is a player
  const isPlayer = !isSpectator && currentUser?.uid && roomData?.players?.[currentUser.uid]

  // Sync questions from Firebase gameData
  useEffect(() => {
    if (roomData?.matchType === 'theory' && roomData?.gameData?.questions) {
      setQuestions(roomData.gameData.questions)
    }
  }, [roomData])

  // Restore player state on page reload (hydrate from Firebase)
  useEffect(() => {
    if (isPlayer && roomData?.players && currentUser?.uid && !stateRestoredRef.current) {
      const playerData = roomData.players[currentUser.uid]
      
      if (playerData) {
        // Restore current question index if it exists
        if (playerData.currentQuestionIndex !== undefined && playerData.currentQuestionIndex !== null) {
          const restoredIndex = playerData.currentQuestionIndex
          if (restoredIndex >= 0 && restoredIndex < questions.length) {
            setCurrentQuestionIndex(restoredIndex)
            console.log(`State restored: question index ${restoredIndex}`)
          }
        }

        // Restore score if it exists (from correctAnswers)
        if (playerData.correctAnswers !== undefined) {
          // Score is already synced via playerScores state from roomData
          console.log(`State restored: score ${playerData.correctAnswers}`)
        }

        // Restore timer based on server startTime
        if (roomData.startTime && roomData.matchType === 'theory') {
          // Handle serverTimestamp: it may be an object {'.sv': 'timestamp'} initially
          let startTimestamp = roomData.startTime
          if (typeof startTimestamp === 'object' && startTimestamp?.['.sv'] === 'timestamp') {
            // Server timestamp placeholder - use current time as fallback
            startTimestamp = Date.now()
          }

          // Calculate elapsed time since match started
          const elapsed = Date.now() - startTimestamp
          const questionDuration = 30000 // 30 seconds per question
          const restoredIndex = playerData.currentQuestionIndex ?? 0
          
          // Calculate how much time has passed on current question
          // If player is on question N, they've spent: N * 30s + remaining time on current question
          // For now, if more than 30s has elapsed, give them full time for current question
          const timeOnCurrentQuestion = Math.max(0, questionDuration - (elapsed % questionDuration))
          const target = Date.now() + timeOnCurrentQuestion
          
          targetTimeRef.current = target
          setTargetTime(target)
          console.log(`State restored: timer reset to ${Math.floor(timeOnCurrentQuestion / 1000)}s`)
        }

        stateRestoredRef.current = true
      } else {
        // No existing state, mark as initialized anyway
        stateRestoredRef.current = true
      }
    }
  }, [isPlayer, roomData, currentUser?.uid, questions.length])

  // Sync current question index for players
  useEffect(() => {
    if (isPlayer && roomId && currentUser?.uid && currentQuestionIndex !== undefined) {
      updatePlayerQuestionIndex(roomId, currentUser.uid, currentQuestionIndex).catch((error) => {
        console.error('Failed to update question index:', error)
      })
    }
  }, [isPlayer, roomId, currentUser?.uid, currentQuestionIndex])

  // For spectators: find the leader and sync to their question
  useEffect(() => {
    if (isSpectator && roomData?.players && questions.length > 0) {
      // Find leader: highest score, then highest question index
      const sortedPlayers = Object.entries(roomData.players)
        .map(([uid, player]) => ({
          uid,
          ...player,
          score: player.correctAnswers || 0,
          currentQuestionIndex: player.currentQuestionIndex ?? 0,
          lastCorrectAt: player.lastCorrectAt || Infinity,
        }))
        .sort((a, b) => {
          // Primary: highest score
          if (b.score !== a.score) {
            return b.score - a.score
          }
          // Secondary: highest question index (most progress)
          if (b.currentQuestionIndex !== a.currentQuestionIndex) {
            return b.currentQuestionIndex - a.currentQuestionIndex
          }
          // Tertiary: earliest timestamp (tie-breaker)
          return a.lastCorrectAt - b.lastCorrectAt
        })

      if (sortedPlayers.length > 0) {
        const leader = sortedPlayers[0]
        const leaderQuestionIndex = leader.currentQuestionIndex ?? 0
        if (leaderQuestionIndex !== currentQuestionIndex && leaderQuestionIndex < questions.length) {
          setCurrentQuestionIndex(leaderQuestionIndex)
          setSelectedAnswer(null)
          setShowFeedback(false)
          setCorrectAnswerIndex(null)
        }
      }
    }
  }, [isSpectator, roomData?.players, questions.length, currentQuestionIndex])

  // Ref to track if timeout was handled (prevents multiple submissions)
  const timeoutHandledRef = useRef(false)

  // handleAnswerSelect callback (only for players)
  const handleAnswerSelect = useCallback(
    async (answerIndex, isTimeout = false) => {
      if (isSubmitting || showFeedback || isSpectator) return

      const question = questions[currentQuestionIndex]
      if (!question) return

      setIsSubmitting(true)
      setSelectedAnswer(answerIndex)
      setCorrectAnswerIndex(question.correctAnswer) // Use correctAnswer instead of correct
      setShowFeedback(true)
      setTargetTime(null) // Stop the timer
      timeoutHandledRef.current = true // Mark timeout as handled

      const isCorrect = answerIndex === question.correctAnswer

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
        }
        setIsSubmitting(false)
      }, 2000)
    },
    [isSubmitting, showFeedback, questions, currentQuestionIndex, roomId, currentUser, isSpectator],
  )

  // Update player scores from room data and check for winner
  useEffect(() => {
    if (roomData?.players && questions.length > 0) {
      const scores = {}
      Object.entries(roomData.players).forEach(([uid, player]) => {
        scores[uid] = player.correctAnswers || 0
      })
      setPlayerScores(scores)

      // Sort players by score (descending) then by lastCorrectAt (ascending - earlier wins)
      // Handle serverTimestamp() which may be an object initially
      const sortedPlayers = Object.entries(roomData.players)
        // Exclude players who have explicitly left the match
        .filter(([uid, player]) => player.status !== 'left')
        .map(([uid, player]) => {
          // Handle Firebase serverTimestamp - it may be an object {'.sv': 'timestamp'} initially
          let lastCorrectAt = Infinity
          if (player.lastCorrectAt) {
            if (typeof player.lastCorrectAt === 'number') {
              lastCorrectAt = player.lastCorrectAt
            } else if (player.lastCorrectAt['.sv'] === 'timestamp') {
              // Server timestamp placeholder - use Infinity for now, will update when resolved
              lastCorrectAt = Infinity
            }
          }

          return {
            uid,
            ...player,
            score: player.correctAnswers || 0,
            lastCorrectAt,
          }
        })
        .sort((a, b) => {
          // Primary sort: highest score first
          if (b.score !== a.score) {
            return b.score - a.score
          }
          // Secondary sort: earliest timestamp first (tie-breaker)
          return a.lastCorrectAt - b.lastCorrectAt
        })

      // Check for match end: when all questions are answered by at least one player
      // Match ends when any player has answered all questions (reached the last question)
      // AND has at least one correct answer (prevents instant win at game start)
      const maxQuestionIndex = questions.length - 1
      const hasPlayerFinished = sortedPlayers.some(
        (player) =>
          (player.currentQuestionIndex ?? 0) >= maxQuestionIndex &&
          (player.correctAnswers || 0) > 0,
      )
      
      // If match has ended, determine winner based on highest score
      if (hasPlayerFinished && sortedPlayers.length > 0 && !winnerDeclaredRef.current) {
        const topPlayer = sortedPlayers[0]
        // Declare winner: player with highest score (or earliest timestamp if tied)
        // Only trigger once per match
        winnerDeclaredRef.current = true
        
        // Calculate and update ratings for current user
        if (isPlayer && currentUser?.uid && !ratingUpdatedRef.current) {
          ratingUpdatedRef.current = true
          
          // Find current user's rank in sorted players
          const currentUserIndex = sortedPlayers.findIndex((p) => p.uid === currentUser.uid)
          if (currentUserIndex !== -1) {
            const currentUserRank = currentUserIndex + 1
            const totalPlayers = sortedPlayers.length
            
            // Get current user's Elo rating and update stats
            getUserProfile(currentUser.uid)
              .then((profile) => {
                const currentElo = profile.elo || 1200
                
                // Calculate rating change
                const ratingChange = calculateRatingChange(currentElo, currentUserRank, totalPlayers)
                const isWin = currentUserRank === 1
                
                // Update user stats in Firestore
                return updateUserStats(currentUser.uid, isWin, ratingChange).then((result) => ({
                  ...result,
                  ratingChange, // Include the calculated rating change
                  oldElo: currentElo, // Include old Elo for display
                }))
              })
              .then((ratingData) => {
                // Pass rating change data to onWinner callback
                onWinner({
                  uid: topPlayer.uid,
                  ...topPlayer,
                  ratingChange: ratingData.ratingChange,
                  newElo: ratingData.newElo,
                  newRank: ratingData.newRank,
                  oldElo: ratingData.oldElo,
                })
              })
              .catch((error) => {
                console.error('Failed to update rating:', error)
                // Still call onWinner even if rating update fails
                onWinner({ uid: topPlayer.uid, ...topPlayer })
              })
            
            // Don't call onWinner here - wait for rating update
            return
          }
        }
        
        // For spectators or if rating update failed, call onWinner directly
        onWinner({ uid: topPlayer.uid, ...topPlayer })
      }
    }
  }, [roomData, onWinner, questions.length])

  // Timer: Set targetTime when question changes (only for players)
  // Use refs to track state and prevent reset when roomData updates
  const lastQuestionIndexRef = useRef(-1) // Initialize to -1 to ensure first question triggers timer
  const targetTimeRef = useRef(null) // Store targetTime in ref to prevent reset on re-renders
  const isInitializedRef = useRef(false) // Track if timer has been initialized
  
  useEffect(() => {
    // Only reset timer if the current user's question index actually changed
    // This prevents timer reset when other players update their question index
    if (isPlayer && currentQuestionIndex < questions.length && !showFeedback) {
      // Only reset if this is a new question for the current user
      // Check against ref to avoid reset when roomData updates cause re-renders
      if (lastQuestionIndexRef.current !== currentQuestionIndex) {
        // Set target time to 30 seconds from now
        const target = Date.now() + 30000
        targetTimeRef.current = target
        setTargetTime(target)
        timeoutHandledRef.current = false // Reset timeout flag for new question
        lastQuestionIndexRef.current = currentQuestionIndex // Update ref
        isInitializedRef.current = true
      }
    }
  }, [isPlayer, currentQuestionIndex, questions.length, showFeedback])
  
  // Initialize targetTime on mount if not set (only once)
  useEffect(() => {
    if (isPlayer && !isInitializedRef.current && currentQuestionIndex < questions.length && !showFeedback && questions.length > 0) {
      const target = Date.now() + 30000
      targetTimeRef.current = target
      setTargetTime(target)
      lastQuestionIndexRef.current = currentQuestionIndex
      isInitializedRef.current = true
    }
  }, [isPlayer, questions.length, currentQuestionIndex, showFeedback])

  // Timer: Update display based on targetTime (prevents pausing when tab is hidden)
  // Use ref to access targetTime to prevent reset when roomData updates
  useEffect(() => {
    if (isPlayer && !showFeedback && currentQuestionIndex < questions.length) {
      const updateTimer = () => {
        // Always use ref value to prevent reset on re-renders caused by roomData updates
        const currentTargetTime = targetTimeRef.current
        if (!currentTargetTime) return
        
        const remaining = Math.max(0, Math.floor((currentTargetTime - Date.now()) / 1000))
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
  }, [isPlayer, showFeedback, currentQuestionIndex, questions.length, handleAnswerSelect])

  // Find leader for spectator view
  const leader = isSpectator
    ? (() => {
        if (!roomData?.players || Object.keys(roomData.players).length === 0) return null

        const sorted = Object.entries(roomData.players)
          .map(([uid, player]) => ({
            uid,
            ...player,
            score: player.correctAnswers || 0,
            currentQuestionIndex: player.currentQuestionIndex ?? 0,
            lastCorrectAt: player.lastCorrectAt || Infinity,
          }))
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score
            if (b.currentQuestionIndex !== a.currentQuestionIndex) return b.currentQuestionIndex - a.currentQuestionIndex
            return a.lastCorrectAt - b.lastCorrectAt
          })

        return sorted[0] || null
      })()
    : null

  if (questions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-neutral-400">Loading questions...</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-neutral-400">No question available</p>
      </div>
    )
  }

  const myScore = playerScores[currentUser?.uid] || 0

  // Spectator View
  if (isSpectator && leader) {
    const leaderQuestionIndex = leader.currentQuestionIndex ?? currentQuestionIndex
    const spectatorQuestion = questions[leaderQuestionIndex] || currentQuestion

    return (
      <div className="flex h-full flex-col bg-neutral-950 text-white">
        {/* Spectator Banner */}
        <div className="border-b border-yellow-500/30 bg-yellow-900/20 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Eye size={18} className="text-yellow-400" />
            <p className="text-sm font-semibold text-yellow-400">
              Spectating: Following {leader.displayName || 'Leader'}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Main Screen: Leader's Current Question */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <motion.div
              key={leaderQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl"
            >
              <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-white sm:mb-6 sm:text-2xl">
                  {spectatorQuestion.question}
                </h2>

                {spectatorQuestion.codeSnippet && (
                  <div className="mb-4 rounded-lg bg-neutral-950 p-3 text-sm text-neutral-300">
                    <pre className="whitespace-pre-wrap font-mono">{spectatorQuestion.codeSnippet}</pre>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  {spectatorQuestion.options.map((option, index) => {
                    const isCorrect = index === spectatorQuestion.correctAnswer
                    const buttonClass = `w-full rounded-lg border p-3 text-left opacity-60 sm:p-4 ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300'
                        : 'border-neutral-700 bg-neutral-800/30 text-neutral-400'
                    }`

                    return (
                      <div key={index} className={buttonClass}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium sm:text-base">{option}</span>
                          {isCorrect && <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500 sm:w-5" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="w-full border-t border-white/10 bg-neutral-900/30 p-4 lg:w-80 lg:border-l lg:border-t-0">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:mb-4 sm:text-sm">
              Leaderboard
            </h3>
            <div className="space-y-2">
              {(() => {
                const sortedPlayers = Object.entries(roomData?.players || {})
                  // Exclude players who have explicitly left the match
                  .filter(([uid, player]) => player.status !== 'left')
                  .map(([uid, player]) => ({
                    uid,
                    ...player,
                    score: player.correctAnswers || 0,
                    lastCorrectAt: player.lastCorrectAt || Infinity,
                  }))
                  .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score
                    return a.lastCorrectAt - b.lastCorrectAt
                  })

                return sortedPlayers.map((player, index) => {
                  const isLeader = player.uid === leader.uid
                  const isWinner = index === 0 && player.score >= winCondition

                  return (
                    <div
                      key={player.uid}
                      className={`rounded-lg border p-2 sm:p-3 ${
                        isWinner
                          ? 'border-yellow-500 bg-yellow-900/20'
                          : isLeader
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-neutral-800 bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-xs font-bold text-neutral-400">#{index + 1}</span>
                          <img
                            src={player.photoURL || '/default-avatar.png'}
                            alt={player.displayName || 'Player'}
                            className="h-8 w-8 flex-shrink-0 rounded-full border border-neutral-700 object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                player.displayName || 'Player',
                              )}&background=dc2626&color=fff&size=32`
                            }}
                          />
                          <span className="truncate text-sm font-semibold text-white">
                            {player.displayName || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isWinner && <Trophy size={16} className="flex-shrink-0 text-yellow-500" />}
                          <span className={`text-base font-bold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
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
      </div>
    )
  }

  // Player View
  return (
    <div className="flex h-full flex-col bg-neutral-950 text-white">
      {/* Header with Score and Timer */}
      <div className="border-b border-white/10 bg-neutral-900/60 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6">
            <div>
              <div className="text-xs text-neutral-400">Your Score</div>
              <div className="text-xl font-bold text-emerald-400 sm:text-2xl">
                {myScore} / {winCondition}
              </div>
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
            <span
              className={`text-lg font-mono font-bold sm:text-xl ${timeRemaining <= 10 ? 'text-red-500' : 'text-white'}`}
            >
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

            {currentQuestion.codeSnippet && (
              <div className="mb-4 rounded-lg bg-neutral-950 p-3 text-sm text-neutral-300">
                <pre className="whitespace-pre-wrap font-mono">{currentQuestion.codeSnippet}</pre>
              </div>
            )}

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
                          {isSelected && !isCorrect && (
                            <XCircle size={18} className="flex-shrink-0 text-red-500 sm:w-5" />
                          )}
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
                  borderColor:
                    selectedAnswer === correctAnswerIndex ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                  backgroundColor:
                    selectedAnswer === correctAnswerIndex ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <p
                  className={`text-sm font-semibold sm:text-base ${selectedAnswer === correctAnswerIndex ? 'text-emerald-400' : 'text-red-400'}`}
                >
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
              .map(([uid, player]) => {
                let lastCorrectAt = Infinity
                if (player.lastCorrectAt) {
                  if (typeof player.lastCorrectAt === 'number') {
                    lastCorrectAt = player.lastCorrectAt
                  } else if (player.lastCorrectAt['.sv'] === 'timestamp') {
                    lastCorrectAt = Infinity
                  }
                }
                return {
                  uid,
                  ...player,
                  score: player.correctAnswers || 0,
                  lastCorrectAt,
                }
              })
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
