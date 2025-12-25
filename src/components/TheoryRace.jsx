import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { submitTheoryAnswer } from '../services/multiplayer'
import { getRandomQuestions } from '../data/theoryQuestions'

const WINNING_SCORE = 10

function TheoryRace({ roomId, roomData, onWinner }) {
  const { currentUser } = useAuth()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null)
  const [playerScores, setPlayerScores] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(30) // 30 seconds per question

  // Initialize questions on mount
  useEffect(() => {
    if (roomData?.matchType === 'theory' && roomData?.currentProblemId) {
      const category = roomData.currentProblemId // e.g., 'cpp-foundations'
      const questionSet = getRandomQuestions(category, 20) // Get 20 questions
      setQuestions(questionSet)
    }
  }, [roomData])

  // Update player scores from room data
  useEffect(() => {
    if (roomData?.players) {
      const scores = {}
      Object.entries(roomData.players).forEach(([uid, player]) => {
        scores[uid] = player.correctAnswers || 0
      })
      setPlayerScores(scores)

      // Check for winner (first to reach WINNING_SCORE)
      Object.entries(roomData.players).forEach(([uid, player]) => {
        if ((player.correctAnswers || 0) >= WINNING_SCORE && !showFeedback) {
          onWinner({ uid, ...player })
        }
      })
    }
  }, [roomData, onWinner, showFeedback])

  // Timer countdown
  useEffect(() => {
    if (currentQuestionIndex < questions.length && !showFeedback) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - auto-submit wrong answer
            handleAnswerSelect(null, true)
            return 30
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestionIndex, questions.length, showFeedback])

  const handleAnswerSelect = async (answerIndex, isTimeout = false) => {
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
        setTimeRemaining(30)
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
      <div className="border-b border-white/10 bg-neutral-900/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-neutral-400">Your Score</div>
              <div className="text-2xl font-bold text-emerald-400">{myScore} / {WINNING_SCORE}</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <div className="text-xs text-neutral-400">Question</div>
              <div className="text-lg font-semibold text-white">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-yellow-500" />
            <span className={`text-xl font-mono font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-white'}`}>
              {timeRemaining}s
            </span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <div className="rounded-xl border border-white/10 bg-neutral-900 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === correctAnswerIndex
                const showResult = showFeedback

                let buttonClass = 'w-full rounded-lg border p-4 text-left transition-all'
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
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && (
                        <>
                          {isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                          {isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
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
                className="mt-6 rounded-lg border p-4"
                style={{
                  borderColor: selectedAnswer === correctAnswerIndex ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                  backgroundColor: selectedAnswer === correctAnswerIndex ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <p className={`font-semibold ${selectedAnswer === correctAnswerIndex ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedAnswer === correctAnswerIndex ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="mt-2 text-sm text-neutral-300">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Sidebar */}
      <div className="w-80 border-l border-white/10 bg-neutral-900/30 p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Leaderboard
        </h3>
        <div className="space-y-2">
          {Object.entries(playerScores)
            .sort(([, a], [, b]) => b - a)
            .map(([uid, score], index) => {
              const player = roomData?.players?.[uid]
              const isMe = uid === currentUser?.uid
              const isWinner = score >= WINNING_SCORE

              return (
                <div
                  key={uid}
                  className={`rounded-lg border p-3 ${
                    isWinner
                      ? 'border-yellow-500 bg-yellow-900/20'
                      : isMe
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-neutral-800 bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-400">#{index + 1}</span>
                      <img
                        src={player?.photoURL || '/default-avatar.png'}
                        alt={player?.displayName || 'Player'}
                        className="h-8 w-8 rounded-full border border-neutral-700 object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            player?.displayName || 'Player',
                          )}&background=dc2626&color=fff&size=32`
                        }}
                      />
                      <span className="text-sm font-semibold text-white">
                        {player?.displayName || 'Anonymous'}
                        {isMe && ' (You)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isWinner && <Trophy size={16} className="text-yellow-500" />}
                      <span className={`font-bold ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                        {score}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default TheoryRace

