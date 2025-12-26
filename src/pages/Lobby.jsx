import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Copy, Check, Plus, Play, Code, BookOpen, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { createRoom, joinRoom, subscribeToRoom, startMatch } from '../services/multiplayer'
import { getCategories } from '../data/theoryQuestions'

function Lobby() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { roomId: urlRoomId } = useParams()
  const [roomId, setRoomId] = useState(urlRoomId || null)
  const [roomData, setRoomData] = useState(null)
  const [joinRoomId, setJoinRoomId] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [matchType, setMatchType] = useState('coding') // 'coding' or 'theory'
  const [theoryCategory, setTheoryCategory] = useState('cpp')

  // If roomId comes from URL, set it
  useEffect(() => {
    if (urlRoomId && urlRoomId !== roomId) {
      setRoomId(urlRoomId)
    }
  }, [urlRoomId])

  // Subscribe to room updates when in waiting room
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = subscribeToRoom(roomId, (data) => {
      if (data === null) {
        // Room was deleted
        setError('Room no longer exists')
        setRoomId(null)
        setRoomData(null)
        return
      }

      setRoomData(data)

      // Check if match has started
      if (data.status === 'playing') {
        console.log('Match status is playing, navigating to arena...', { roomId, status: data.status })
        // Navigate to arena with room ID
        navigate(`/arena/${roomId}`, { replace: true })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [roomId, navigate])

  // Also check roomData.status directly in case we missed the update
  useEffect(() => {
    if (roomData?.status === 'playing' && roomId) {
      console.log('Room status is playing (direct check), navigating...', { roomId })
      navigate(`/arena/${roomId}`, { replace: true })
    }
  }, [roomData?.status, roomId, navigate])

  const handleCreateRoom = async () => {
    if (!currentUser) {
      setError('You must be logged in to create a room')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const newRoomId = await createRoom(currentUser)
      setRoomId(newRoomId)
    } catch (err) {
      console.error('Failed to create room:', err)
      setError(err.message || 'Failed to create room')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinRoom = async (role = 'player') => {
    if (!currentUser) {
      setError('You must be logged in to join a room')
      return
    }

    if (!joinRoomId.trim() || joinRoomId.trim().length !== 6) {
      setError('Please enter a valid 6-digit room code')
      return
    }

    setIsJoining(true)
    setError(null)

    try {
      const result = await joinRoom(joinRoomId.trim().toUpperCase(), currentUser, role)

      if (!result.success) {
        setError('Failed to join room')
        return
      }

      const roomIdToSet = joinRoomId.trim().toUpperCase()
      setRoomId(roomIdToSet)
      
      // If joining as spectator, navigate directly to arena
      if (result.role === 'spectator') {
        navigate(`/arena/${roomIdToSet}`, { 
          state: { role: 'spectator' },
          replace: true 
        })
      }
    } catch (err) {
      console.error('Failed to join room:', err)
      setError(err.message || 'Failed to join room')
    } finally {
      setIsJoining(false)
    }
  }

  const handleCopyRoomCode = async () => {
    if (!roomId) return

    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleStartMatch = async () => {
    if (!roomId || !currentUser) {
      console.error('Cannot start match: missing roomId or currentUser', { roomId, currentUser })
      setError('Cannot start match: missing room or user')
      return
    }

    console.log('Starting match...', { roomId, userId: currentUser.uid, matchType })
    setIsStarting(true)
    setError(null)

    try {
      // Determine problemId based on match type
      const problemId = matchType === 'theory' ? theoryCategory : '1-20'
      
      // For theory race, get question count to set winCondition
      let questionCount = null
      if (matchType === 'theory') {
        const { getRandomQuestions } = await import('../data/theoryQuestions')
        // Get questions for the selected category (same as TheoryRace component)
        const questions = getRandomQuestions(theoryCategory, 20)
        questionCount = questions.length
        console.log(`Theory race: ${questionCount} questions available for category "${theoryCategory}"`)
      }
      
      await startMatch(roomId, problemId, matchType, questionCount)
      console.log('Match started successfully, waiting for navigation...')
      // Navigation will happen automatically via the useEffect listener
    } catch (err) {
      console.error('Failed to start match:', err)
      setError(err.message || 'Failed to start match')
      setIsStarting(false)
    }
  }

  const isHost = roomData && currentUser && roomData.hostId === currentUser.uid
  const playerCount = roomData?.players ? Object.keys(roomData.players).length : 0
  const spectatorCount = roomData?.spectators ? Object.keys(roomData.spectators).length : 0
  const isSpectator = currentUser?.uid && roomData?.spectators?.[currentUser.uid] && !roomData?.players?.[currentUser.uid]
  const canStart = isHost && playerCount >= 2

  // Debug logging
  useEffect(() => {
    if (roomData) {
      console.log('Room data updated:', {
        status: roomData.status,
        hostId: roomData.hostId,
        currentUserId: currentUser?.uid,
        isHost,
        playerCount,
        canStart,
        players: roomData.players,
      })
    }
  }, [roomData, isHost, playerCount, canStart, currentUser])

      // State C: Match is Playing - Navigate to Arena
      // This state is handled by the useEffect that navigates to /arena/:roomId
      // The Arena component will render the match view

  // State B: Waiting Room
  if (roomId && roomData) {
    const players = roomData.players ? Object.entries(roomData.players) : []
    const spectators = roomData.spectators ? Object.entries(roomData.spectators) : []

    return (
      <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
        <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-20 sm:pt-24">
          {/* Spectator Banner */}
          {isSpectator && (
            <div className="mb-6 rounded-lg border border-yellow-500/50 bg-yellow-900/20 p-4 text-center">
              <p className="text-sm font-semibold text-yellow-400">
                👁️ You are spectating this match. You will be able to watch when the match starts.
              </p>
            </div>
          )}

          {/* Room Code Display */}
          <div className="mb-6 text-center sm:mb-8">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:mb-4">
              Room Code
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-4 sm:px-8 sm:py-6">
                <span className="text-3xl font-mono font-bold tracking-[0.3em] text-white sm:text-6xl sm:tracking-[0.5em]">
                  {roomId.split('').join(' ')}
                </span>
              </div>
              <button
                onClick={handleCopyRoomCode}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 transition-colors active:scale-95 hover:border-white/20 hover:bg-neutral-800 sm:h-14 sm:w-14"
                title="Copy room code"
              >
                {copied ? (
                  <Check size={20} className="text-emerald-400 sm:w-6" />
                ) : (
                  <Copy size={20} className="text-neutral-400 sm:w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Players Grid */}
          <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Players ({playerCount})</h2>
            {players.length === 0 ? (
              <p className="text-center text-sm text-neutral-500">No players yet...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {players.map(([uid, player]) => {
                  const isPlayerHost = player.status === 'host' || uid === roomData.hostId
                  return (
                    <div
                      key={uid}
                      className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/60 p-4"
                    >
                      <img
                        src={player.photoURL || '/default-avatar.png'}
                        alt={player.displayName || 'Player'}
                        className="h-12 w-12 rounded-full border border-neutral-700 object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            player.displayName || 'Player',
                          )}&background=dc2626&color=fff&size=48`
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {player.displayName || 'Anonymous'}
                          </p>
                          {isPlayerHost && (
                            <span className="text-lg" role="img" aria-label="Host">
                              👑
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Spectators Grid */}
          {spectators.length > 0 && (
            <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Spectators ({spectatorCount})</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {spectators.map(([uid, spectator]) => (
                  <div
                    key={uid}
                    className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800/40 p-4 opacity-75"
                  >
                    <img
                      src={spectator.photoURL || '/default-avatar.png'}
                      alt={spectator.displayName || 'Spectator'}
                      className="h-12 w-12 rounded-full border border-neutral-700 object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          spectator.displayName || 'Spectator',
                        )}&background=6b7280&color=fff&size=48`
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-neutral-300">
                          {spectator.displayName || 'Anonymous'}
                        </p>
                        <span className="text-xs text-neutral-500">👁️</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

              {/* Match Type Selection (Host Only) */}
              {isHost && (
                <div className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:mb-6 sm:p-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:mb-4 sm:text-sm">
                    Match Type
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {/* Coding Challenge */}
                    <button
                      onClick={() => setMatchType('coding')}
                      className={`rounded-lg border p-3 text-left transition-all active:scale-95 sm:p-4 ${
                        matchType === 'coding'
                          ? 'border-red-600 bg-red-900/20'
                          : 'border-neutral-800 bg-neutral-800/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Code size={18} className={matchType === 'coding' ? 'text-red-400' : 'text-neutral-400'} />
                        <span className={`text-sm font-semibold sm:text-base ${matchType === 'coding' ? 'text-red-400' : 'text-neutral-300'}`}>
                          Coding Challenge
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        Solve C++ problems in real-time
                      </p>
                    </button>

                    {/* Theory Race */}
                    <button
                      onClick={() => setMatchType('theory')}
                      className={`rounded-lg border p-3 text-left transition-all active:scale-95 sm:p-4 ${
                        matchType === 'theory'
                          ? 'border-yellow-600 bg-yellow-900/20'
                          : 'border-neutral-800 bg-neutral-800/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <BookOpen size={18} className={matchType === 'theory' ? 'text-yellow-400' : 'text-neutral-400'} />
                        <span className={`text-sm font-semibold sm:text-base ${matchType === 'theory' ? 'text-yellow-400' : 'text-neutral-300'}`}>
                          Theory Race
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        First to 10 correct answers wins
                      </p>
                    </button>
              </div>

              {/* Theory Category Selection */}
              {matchType === 'theory' && (
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Category
                  </label>
                  <select
                    value={theoryCategory}
                    onChange={(e) => setTheoryCategory(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white focus:border-yellow-600 focus:outline-none"
                  >
                    {getCategories().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Action Section */}
          <div className="text-center">
            {isSpectator ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-semibold text-yellow-400">
                  👁️ You are spectating. The match will begin when the host starts it.
                </span>
              </div>
            ) : isHost ? (
              <div>
                <button
                  onClick={handleStartMatch}
                  disabled={!canStart || isStarting}
                  className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors active:scale-95 sm:px-8 sm:py-4 sm:text-base ${
                    canStart && !isStarting
                      ? matchType === 'theory' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'
                      : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Play size={18} className="sm:w-5" />
                  <span>{isStarting ? 'Starting...' : `Start ${matchType === 'theory' ? 'Theory Race' : 'Match'}`}</span>
                </button>
                {!canStart && (
                  <p className="mt-3 text-sm text-neutral-500">
                    Waiting for at least 2 players to start
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-pulse text-lg font-semibold text-neutral-400">
                  Waiting for Host...
                </span>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-500/50 bg-red-900/30 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  // State A: Selection Menu
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="grid gap-8 md:grid-cols-2">
              {/* Create Room Card */}
              <button
                onClick={handleCreateRoom}
                disabled={isCreating || !currentUser}
                className={`group relative rounded-xl border p-8 text-center transition-all active:scale-95 sm:p-12 ${
                  isCreating || !currentUser
                    ? 'border-neutral-800 bg-neutral-900 cursor-not-allowed opacity-50'
                    : 'border-neutral-800 bg-neutral-900 hover:border-red-600/50 hover:bg-neutral-900/80 hover:shadow-[0_0_25px_rgba(220,38,38,0.3)]'
                }`}
              >
                <div className="mb-4 flex justify-center sm:mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-800 sm:h-20 sm:w-20">
                    <Plus size={32} className="text-red-600 sm:w-10" />
                  </div>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white sm:text-2xl">Create Room</h2>
                {isCreating && (
                  <p className="mt-4 text-sm text-neutral-500">Creating room...</p>
                )}
              </button>

              {/* Join Room Card */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 sm:p-12">
                <h2 className="mb-4 text-xl font-semibold text-white sm:mb-6 sm:text-2xl">Join Room</h2>
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                      if (value.length <= 6) {
                        setJoinRoomId(value)
                      }
                    }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    disabled={isJoining || !currentUser}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-3 font-mono text-center text-xl tracking-widest text-white placeholder:text-neutral-600 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-4 sm:text-2xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isJoining && currentUser && joinRoomId.length === 6) {
                        handleJoinRoom('player')
                      }
                    }}
                  />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      onClick={() => handleJoinRoom('player')}
                      disabled={isJoining || !currentUser || joinRoomId.length !== 6}
                      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors active:scale-95 sm:px-6 sm:text-base ${
                        isJoining || !currentUser || joinRoomId.length !== 6
                          ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      <Play size={16} className="sm:w-5" />
                      <span>{isJoining ? 'Joining...' : 'Join Match'}</span>
                    </button>
                    <button
                      onClick={() => handleJoinRoom('spectator')}
                      disabled={isJoining || !currentUser || joinRoomId.length !== 6}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors active:scale-95 sm:px-6 sm:text-base ${
                        isJoining || !currentUser || joinRoomId.length !== 6
                          ? 'border-neutral-700 bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
                          : 'border-neutral-600 bg-neutral-800/50 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      <Eye size={16} className="sm:w-5" />
                      <span>{isJoining ? 'Joining...' : 'Spectate'}</span>
                    </button>
                  </div>
                </div>
              </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-8 rounded-lg border border-red-500/50 bg-red-900/30 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Not Logged In Warning */}
        {!currentUser && (
          <div className="mt-8 rounded-lg border border-yellow-500/50 bg-yellow-900/30 p-4 text-sm text-yellow-300">
            You must be logged in to create or join a room.
          </div>
        )}
      </div>
    </div>
  )
}

export default Lobby

