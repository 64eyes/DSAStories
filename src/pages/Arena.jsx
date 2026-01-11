import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Users, AlertTriangle, RotateCcw, Home, LogOut, X } from 'lucide-react'
import Confetti from 'react-confetti'
import CodeEditor from '../components/CodeEditor'
import TheoryRace from '../components/TheoryRace'
import EloAnimation from '../components/EloAnimation'
import ConfirmModal from '../components/ConfirmModal'
import NotificationToast from '../components/NotificationToast'
import { useAuth } from '../contexts/AuthContext'
import { subscribeToRoom, updatePlayerStatus, updatePlayerCode, flagSuspiciousActivity, resetMatch, leaveMatch, removeSpectator } from '../services/multiplayer'
import { CHAPTER_CONTENT } from '../data/chapterContent'

// Solo Mode (no roomId)
function SoloArena() {
  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-white">
      {/* Minimalist Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-neutral-950/60 px-6 py-4 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-white">The Arena</h1>
      </header>

      {/* Code Editor Container */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full">
          <CodeEditor />
        </div>
      </div>
    </div>
  )
}

// Multiplayer Mode (with roomId)
function MultiplayerArena({ roomId }) {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [roomData, setRoomData] = useState(null)
  
  // Modal and notification state
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveModalConfig, setLeaveModalConfig] = useState({ title: '', message: '', variant: 'danger' })
  const [pendingLeaveAction, setPendingLeaveAction] = useState(null) // 'player' or 'spectator'
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: 'info' })
  const previousPlayersRef = useRef(null) // Track previous player states to detect changes
  const [winner, setWinner] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showPostMatch, setShowPostMatch] = useState(false)
  const [ratingChange, setRatingChange] = useState(null) // Store rating change data for animation
  const [oldElo, setOldElo] = useState(null)
  const [newElo, setNewElo] = useState(null)
  const hasPushedStateRef = useRef(false) // Track if we've pushed history state for back button
  
  // Get role from navigation state or determine from room data
  const roleFromState = location.state?.role

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      if (data === null) {
        setRoomData(null)
        // If room is deleted, navigate back to lobby
        navigate('/lobby', { replace: true })
        return
      }

      setRoomData(data)

      // Check for winner based on match type
      if (data.players) {
        const players = Object.entries(data.players)
        
        if (data.matchType === 'theory') {
          // Theory race: winner is determined by TheoryRace component
          // Match ends when all questions are answered, winner is highest score
          // This logic is handled in TheoryRace component, so we don't need to check here
        } else {
          // Coding challenge: winner is first to success
          const winnerPlayer = players.find(([uid, player]) => player.status === 'success')
          if (winnerPlayer && !winner) {
            const [winnerUid, winnerData] = winnerPlayer
            setWinner({
              uid: winnerUid,
              ...winnerData,
            })
            // TODO: If rating changes are needed for coding matches, calculate and set here:
            // - Calculate rating change using calculateRatingChange from rating.js
            // - Update user stats using updateUserStats from rating.js
            // - Set ratingChange, oldElo, newElo state for display
            setShowConfetti(true)
            setShowPostMatch(true)
            setTimeout(() => setShowConfetti(false), 5000)
          }
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [roomId, winner, navigate])

  // Get chapter data for the problem
  const problemId = roomData?.currentProblemId || '1-20'
  const chapter = CHAPTER_CONTENT[problemId]

  // Determine role: check navigation state first, then room data
  const playerRecord =
    currentUser?.uid && roomData?.players ? roomData.players[currentUser.uid] : null
  const isSpectatorExplicit = roleFromState === 'spectator'
  const isSpectatorFromRoom =
    currentUser?.uid &&
    roomData?.spectators?.[currentUser.uid] &&
    (!playerRecord || playerRecord.status === 'left')
  const isSpectator = isSpectatorExplicit || isSpectatorFromRoom
  const isPlayer =
    !isSpectator &&
    !!(currentUser?.uid && playerRecord && playerRecord.status !== 'left')

  // Common leave confirmation handler
  const handleLeaveConfirm = useCallback(async () => {
    if (!roomId || !currentUser?.uid) return

    try {
      if (pendingLeaveAction === 'player') {
        await leaveMatch(roomId, currentUser.uid)
      } else if (pendingLeaveAction === 'spectator') {
        await removeSpectator(roomId, currentUser.uid)
      }
      setShowLeaveModal(false)
      setPendingLeaveAction(null)
      navigate('/lobby', { replace: true })
    } catch (error) {
      console.error('Failed to leave:', error)
      setShowLeaveModal(false)
      setPendingLeaveAction(null)
      // Still navigate even if marking as left fails
      navigate('/lobby', { replace: true })
    }
  }, [roomId, currentUser?.uid, pendingLeaveAction, navigate])

  // Warn players before leaving an active match (browser/tab close)
  useEffect(() => {
    if (!roomData || roomData.status !== 'playing' || !isPlayer) return

    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = 'Are you sure you want to leave this match? You will be marked as having left.'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [roomData?.status, isPlayer])

  // Handle back button navigation with confirmation
  useEffect(() => {
    if (!roomData || (!isPlayer && !isSpectator)) return

    // Push a state to enable back button detection (only once per mount)
    if (!hasPushedStateRef.current) {
      window.history.pushState(null, '', window.location.pathname)
      hasPushedStateRef.current = true
    }

    const handlePopState = () => {
      // Only block if match is active (or even in waiting room)
      if (isPlayer) {
        if (roomData.status === 'playing') {
          setLeaveModalConfig({
            title: 'Leave Match?',
            message: 'Are you sure you want to leave this match?\n\nYou will be marked as having left and cannot rejoin as a player.',
            variant: 'danger',
          })
          setPendingLeaveAction('player')
          setShowLeaveModal(true)
        } else {
          setLeaveModalConfig({
            title: 'Leave Room?',
            message: 'Are you sure you want to leave this room?',
            variant: 'warning',
          })
          setPendingLeaveAction('player')
          setShowLeaveModal(true)
        }
      } else {
        setLeaveModalConfig({
          title: 'Leave?',
          message: 'Are you sure you want to leave?',
          variant: 'warning',
        })
        setPendingLeaveAction('spectator')
        setShowLeaveModal(true)
      }

      // Push current state back to prevent navigation
      window.history.pushState(null, '', window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [roomData, isPlayer, isSpectator, roomId, currentUser?.uid, navigate])

  // Mark player/spectator as having left when component unmounts
  useEffect(() => {
    return () => {
      if (roomId && currentUser?.uid) {
        if (isPlayer) {
          leaveMatch(roomId, currentUser.uid).catch((error) => {
            console.error('Failed to mark player as left match:', error)
          })
        } else if (isSpectator) {
          removeSpectator(roomId, currentUser.uid).catch((error) => {
            console.error('Failed to remove spectator:', error)
          })
        }
      }
    }
  }, [roomId, currentUser?.uid, roomData?.status, isPlayer, isSpectator])

  // Get all active players (exclude those who left)
  const allPlayers = roomData?.players
    ? Object.entries(roomData.players).filter(([, player]) => player.status !== 'left')
    : []

  // Get opponents (filter out current user)
  const opponents = allPlayers.filter(([uid]) => uid !== currentUser?.uid)

  // Get current player data
  const currentPlayer = currentUser?.uid && roomData?.players?.[currentUser.uid]
    ? roomData.players[currentUser.uid]
    : null

  const handleRunStart = async () => {
    if (!roomId || !currentUser?.uid) return
    try {
      await updatePlayerStatus(roomId, currentUser.uid, 'compiling')
    } catch (error) {
      console.error('Failed to update player status:', error)
    }
  }

  const handleSuccess = async () => {
    if (!roomId || !currentUser?.uid) return
    try {
      await updatePlayerStatus(roomId, currentUser.uid, 'success')
    } catch (error) {
      console.error('Failed to update player status:', error)
    }
  }

  const handleError = async () => {
    if (!roomId || !currentUser?.uid) return
    try {
      await updatePlayerStatus(roomId, currentUser.uid, 'failed')
    } catch (error) {
      console.error('Failed to update player status:', error)
    }
  }

  const handleCodeChange = async (code) => {
    if (!roomId || !currentUser?.uid) return
    try {
      await updatePlayerCode(roomId, currentUser.uid, code)
    } catch (error) {
      console.error('Failed to update player code:', error)
    }
  }

  const handleSuspiciousActivity = async (type) => {
    if (!roomId || !currentUser?.uid) return
    try {
      const flagMessage = type === 'paste' ? 'Paste Detected' : type
      await flagSuspiciousActivity(roomId, currentUser.uid, flagMessage)
    } catch (error) {
      console.error('Failed to flag suspicious activity:', error)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-600 text-white'
      case 'compiling':
        return 'bg-yellow-600 text-white'
      case 'failed':
        return 'bg-red-600 text-white'
      case 'coding':
      default:
        return 'bg-neutral-700 text-neutral-300'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'success':
        return 'Success'
      case 'compiling':
        return 'Compiling'
      case 'failed':
        return 'Failed'
      case 'coding':
      default:
        return 'Coding'
    }
  }

  const hasSuspiciousFlags = (player) => {
    if (!player.flags) return false
    // Check if flags object contains "Paste Detected" or similar
    const flags = typeof player.flags === 'object' ? Object.values(player.flags) : []
    return flags.some(flag => flag && flag.toString().includes('Paste'))
  }

  const handleNextChallenge = async () => {
    // Reset match state
    try {
      await resetMatch(roomId)
      setWinner(null)
      setShowPostMatch(false)
      setRatingChange(null)
      setOldElo(null)
      setNewElo(null)
      // Room will reset to 'waiting' status, which will trigger navigation back to lobby
    } catch (error) {
      console.error('Failed to reset match:', error)
    }
  }

  const handleReturnToLobby = () => {
    navigate(`/lobby`)
  }

  // Handle player leaving/resigning
  const handlePlayerLeave = () => {
    const isDuringMatch = roomData?.status === 'playing'
    setLeaveModalConfig({
      title: isDuringMatch ? 'Resign from Match?' : 'Leave Room?',
      message: isDuringMatch
        ? 'Are you sure you want to resign from this match?\n\nConsequences:\n• You will be marked as having left\n• You cannot rejoin as a player\n• Your opponent will win by default'
        : 'Are you sure you want to leave this room?',
      variant: 'danger',
    })
    setPendingLeaveAction('player')
    setShowLeaveModal(true)
  }

  // Handle spectator leaving
  const handleSpectatorLeave = () => {
    setLeaveModalConfig({
      title: 'Stop Spectating?',
      message: 'Are you sure you want to stop spectating?',
      variant: 'warning',
    })
    setPendingLeaveAction('spectator')
    setShowLeaveModal(true)
  }

  // Render modal and notification globally
  const renderModalAndNotification = () => (
    <>
      <ConfirmModal
        isOpen={showLeaveModal}
        title={leaveModalConfig.title}
        message={leaveModalConfig.message}
        variant={leaveModalConfig.variant}
        confirmText={pendingLeaveAction === 'player' && roomData?.status === 'playing' ? 'Resign' : 'Confirm'}
        cancelText="Cancel"
        onConfirm={handleLeaveConfirm}
        onCancel={() => {
          setShowLeaveModal(false)
          setPendingLeaveAction(null)
        }}
      />
      <NotificationToast
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
    </>
  )

  if (!roomData) {
    return (
      <>
        {renderModalAndNotification()}
        <div className="flex h-screen items-center justify-center bg-neutral-950 text-white">
          <div className="text-center">
            <p className="text-neutral-400">Loading room data...</p>
          </div>
        </div>
      </>
    )
  }

  // Post-Match Screen
  if (showPostMatch && winner) {
    return (
      <>
        {renderModalAndNotification()}
        <div className="flex h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        )}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl rounded-2xl border border-yellow-500/50 bg-neutral-900 p-8 text-center shadow-2xl"
        >
          <h1 className="mb-4 text-4xl font-bold text-yellow-400">Match Complete!</h1>
          <p className="mb-8 text-xl text-neutral-300">
            {winner.uid === currentUser?.uid
              ? '🎉 Congratulations! You won!'
              : `${winner.displayName || 'A player'} won the match!`}
          </p>
          
          {/* Rating Change Animation */}
          {ratingChange !== null && oldElo !== null && newElo !== null && (
            <EloAnimation oldElo={oldElo} newElo={newElo} ratingChange={ratingChange} />
          )}
          
          <div className="mb-8 flex justify-center gap-4">
            <button
              onClick={handleNextChallenge}
              className="flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-yellow-700"
            >
              <RotateCcw size={20} />
              <span>Next Challenge</span>
            </button>
            <button
              onClick={handleReturnToLobby}
              className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              <Home size={20} />
              <span>Return to Lobby</span>
            </button>
          </div>
        </motion.div>
      </div>
      </>
    )
  }

  // Theory Race Mode
  if (roomData.matchType === 'theory') {
    // Theory race view (handles both players and spectators)
    // Only show confetti for spectators when there's a winner, or in post-match screen
    const shouldShowConfetti = ((isSpectator && winner) || (showPostMatch && winner)) && showConfetti
    
    return (
      <>
        {renderModalAndNotification()}
        <div className="flex h-screen flex-col bg-neutral-950 text-white">
        {shouldShowConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        )}
        {/* Header with Leave button for Theory Race */}
        <header className="flex items-center justify-between border-b border-white/10 bg-neutral-950/60 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
          <div>
            <h1 className="text-lg font-bold text-white sm:text-xl">Theory Race</h1>
            {isSpectator && (
              <p className="mt-1 text-xs font-semibold text-yellow-400">👁️ You are watching</p>
            )}
          </div>
          <button
            onClick={isSpectator ? handleSpectatorLeave : handlePlayerLeave}
            className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:border-red-500"
          >
            <LogOut size={16} />
            <span>{isSpectator ? 'Leave' : roomData?.status === 'playing' ? 'Resign' : 'Leave'}</span>
          </button>
        </header>
        <TheoryRace
          roomId={roomId}
          roomData={roomData}
          isSpectator={isSpectator}
          onWinner={(winnerData) => {
            setWinner(winnerData)
            // Store rating change data if available
            if (winnerData.ratingChange !== undefined) {
              setRatingChange(winnerData.ratingChange)
              setOldElo(winnerData.oldElo)
              setNewElo(winnerData.newElo)
            }
            // Only set confetti if current user is the winner or is a spectator
            if (winnerData.uid === currentUser?.uid || isSpectator) {
              setShowConfetti(true)
            }
            setShowPostMatch(true)
            setTimeout(() => setShowConfetti(false), 5000)
          }}
        />
      </div>
      </>
    )
  }

  // SPECTATOR VIEW: 2x2 Grid (for spectators or non-players)
  if (isSpectator || !isPlayer) {
    // Take first 4 players for the grid
    const playersToShow = allPlayers.slice(0, 4)
    
    // Only show confetti for spectators when there's a winner
    const shouldShowConfetti = isSpectator && winner && showConfetti
    
    return (
      <>
        {renderModalAndNotification()}
        <div className="flex h-screen flex-col bg-neutral-950 text-white">
        {/* Confetti - only for spectators when winner is declared */}
        {shouldShowConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        )}

        {/* Header */}
        <header className="flex flex-col gap-2 border-b border-white/10 bg-neutral-950/60 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div>
            <h1 className="text-lg font-bold text-white sm:text-xl">The Arena - Spectator View</h1>
            {isSpectator && (
              <p className="mt-1 text-xs font-semibold text-yellow-400">👁️ You are watching</p>
            )}
            {chapter && (
              <p className="text-xs text-neutral-400">{chapter.title}</p>
            )}
            {roomData?.matchType === 'theory' && roomData?.currentProblemId && (
              <p className="text-xs text-neutral-400">Theory Race: {roomData.currentProblemId}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400 sm:text-sm">
              <Users size={14} className="sm:w-4" />
              <span>{allPlayers.length} Players</span>
              {roomData?.spectators && Object.keys(roomData.spectators).length > 0 && (
                <span className="text-neutral-500">• {Object.keys(roomData.spectators).length} Spectators</span>
              )}
            </div>
            <button
              onClick={handleSpectatorLeave}
              className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:border-red-500"
            >
              <LogOut size={16} />
              <span>Leave</span>
            </button>
          </div>
        </header>

        {/* 2x2 Grid of Player Editors */}
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
            {playersToShow.map(([uid, player], index) => {
              const isWinner = winner && winner.uid === uid
              const isSuspicious = hasSuspiciousFlags(player)
              const isDimmed = winner && !isWinner

              return (
                <motion.div
                  key={uid}
                  className={`relative flex flex-col overflow-hidden rounded-xl border transition-all ${
                    isWinner
                      ? 'scale-105 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]'
                      : isDimmed
                      ? 'border-white/10 opacity-30 grayscale'
                      : 'border-white/10'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isDimmed ? 0.3 : 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Player Header */}
                  <div className={`flex items-center justify-between border-b border-white/10 bg-neutral-900/60 px-4 py-3 ${
                    isWinner ? 'bg-yellow-900/30' : ''
                  }`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={player.photoURL || '/default-avatar.png'}
                        alt={player.displayName || 'Player'}
                        className="h-8 w-8 rounded-full border border-neutral-700 object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            player.displayName || 'Player',
                          )}&background=dc2626&color=fff&size=32`
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {player.displayName || 'Anonymous'}
                          </p>
                          {isSuspicious && (
                            <AlertTriangle size={16} className="text-yellow-500" />
                          )}
                        </div>
                        <span
                          className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold ${getStatusBadgeColor(
                            player.status || 'coding',
                          )}`}
                        >
                          {getStatusLabel(player.status || 'coding')}
                        </span>
                      </div>
                    </div>
                    {isWinner && (
                      <div className="rounded-lg bg-yellow-500/20 px-3 py-1">
                        <span className="text-xs font-bold uppercase text-yellow-400">VICTORY</span>
                      </div>
                    )}
                  </div>

                  {/* Code Editor (Read-Only) */}
                  <div className="flex-1 overflow-hidden">
                    {roomData?.matchType === 'coding' && (
                      <CodeEditor
                        initialCode={player.code || chapter?.starterCode || ''}
                        readOnly={true}
                      />
                    )}
                    {roomData?.matchType === 'theory' && (
                      <div className="flex h-full items-center justify-center bg-neutral-900/50 p-4">
                        <p className="text-center text-neutral-400">
                          {player.displayName || 'Player'} is in a Theory Race.
                          {player.correctAnswers !== undefined && (
                            <span className="block mt-2 text-emerald-400 font-semibold">
                              Score: {player.correctAnswers} / {roomData.winCondition || 10}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      </>
    )
  }

  // PLAYER VIEW: Split Layout
  // Only show confetti in post-match screen, not during gameplay
  return (
    <>
      {renderModalAndNotification()}
      <div className="flex h-screen flex-col bg-neutral-950 text-white">

      {/* Header */}
      <header className="flex flex-col gap-2 border-b border-white/10 bg-neutral-950/60 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div>
          <h1 className="text-lg font-bold text-white sm:text-xl">The Arena</h1>
          {chapter && (
            <p className="text-xs text-neutral-400">{chapter.title}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400 sm:text-sm">
            <Users size={14} className="sm:w-4" />
            <span>{allPlayers.length} Players</span>
          </div>
          <button
            onClick={handlePlayerLeave}
            className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:border-red-500"
          >
            <X size={16} />
            <span>{roomData?.status === 'playing' ? 'Resign' : 'Leave'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Main Area - Code Editor */}
        <div className="flex-1 overflow-hidden p-3 sm:p-6">
          <CodeEditor
            initialCode={chapter?.starterCode}
            onSuccess={handleSuccess}
            onRunStart={handleRunStart}
            onError={handleError}
            onCodeChange={handleCodeChange}
            onSuspiciousActivity={handleSuspiciousActivity}
          />
        </div>

        {/* Sidebar - Opponents */}
        <div className="w-full border-t border-white/10 bg-neutral-900/30 p-3 lg:w-80 lg:border-l lg:border-t-0 lg:p-4">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            Opponents
          </h2>
          {opponents.length === 0 ? (
            <p className="text-sm text-neutral-500">No other players in the room</p>
          ) : (
            <div className="space-y-3">
              {opponents.map(([uid, player]) => {
                const isWinner = winner && winner.uid === uid
                const isSuspicious = hasSuspiciousFlags(player)
                const isDimmed = winner && !isWinner

                return (
                  <motion.div
                    key={uid}
                    className={`rounded-lg border p-2.5 transition-all sm:p-3 ${
                      isWinner
                        ? 'scale-105 border-yellow-500 bg-yellow-900/20 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                        : isDimmed
                        ? 'border-neutral-800 bg-neutral-800/30 opacity-30 grayscale'
                        : 'border-neutral-800 bg-neutral-800/60'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isDimmed ? 0.3 : 1, x: 0 }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={player.photoURL || '/default-avatar.png'}
                        alt={player.displayName || 'Player'}
                        className="h-8 w-8 flex-shrink-0 rounded-full border border-neutral-700 object-cover sm:h-10 sm:w-10"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            player.displayName || 'Player',
                          )}&background=dc2626&color=fff&size=40`
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <p className="truncate text-xs font-semibold text-white sm:text-sm">
                            {player.displayName || 'Anonymous'}
                          </p>
                          {isSuspicious && (
                            <AlertTriangle size={12} className="flex-shrink-0 text-yellow-500 sm:w-3.5" />
                          )}
                          {isWinner && (
                            <div className="ml-auto flex-shrink-0 rounded bg-yellow-500/20 px-1.5 py-0.5 sm:px-2">
                              <span className="text-[10px] font-bold uppercase text-yellow-400 sm:text-xs">WINNER</span>
                            </div>
                          )}
                        </div>
                        <span
                          className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:text-xs ${getStatusBadgeColor(
                            player.status || 'coding',
                          )}`}
                        >
                          {getStatusLabel(player.status || 'coding')}
                        </span>
                      </div>
                    </div>
                    {player.progress !== undefined && (
                      <div className="mt-2">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-700">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${player.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
      </>
  )
}

// Main Arena Component
function Arena() {
  const { roomId } = useParams()

  // If no roomId, show solo mode
  if (!roomId) {
    return <SoloArena />
  }

  // If roomId exists, show multiplayer mode
  return <MultiplayerArena roomId={roomId} />
}

export default Arena
