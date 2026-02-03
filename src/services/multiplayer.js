/**
 * Multiplayer Service
 * Handles real-time multiplayer game rooms using Firebase Realtime Database
 */

import { ref, set, get, onValue, update, push, child, serverTimestamp, runTransaction } from 'firebase/database'
import { rtdb } from './firebase'

/**
 * Generate a random 6-character alphanumeric room ID (uppercase)
 * @returns {string} - 6-character room ID
 */
function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let roomId = ''
  for (let i = 0; i < 6; i++) {
    roomId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return roomId
}

/**
 * Create a new multiplayer room
 * @param {Object} hostUser - The Firebase user object of the host
 * @returns {Promise<string>} - The generated roomId
 * @throws {Error} - If Realtime Database is not initialized or creation fails
 */
export async function createRoom(hostUser) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!hostUser || !hostUser.uid) {
    throw new Error('hostUser with uid is required')
  }

  try {
    // Generate unique room ID
    let roomId = generateRoomId()
    let roomRef = ref(rtdb, `rooms/${roomId}`)

    // Check if room already exists (unlikely but possible)
    const snapshot = await get(roomRef)
    let attempts = 0
    while (snapshot.exists() && attempts < 10) {
      roomId = generateRoomId()
      roomRef = ref(rtdb, `rooms/${roomId}`)
      const newSnapshot = await get(roomRef)
      if (!newSnapshot.exists()) break
      attempts++
    }

    if (snapshot.exists() && attempts >= 10) {
      throw new Error('Failed to generate unique room ID after multiple attempts')
    }

    // Create initial room data
    const roomData = {
      status: 'waiting',
      hostId: hostUser.uid,
      createdAt: Date.now(),
      players: {
        [hostUser.uid]: {
          displayName: hostUser.displayName || 'Anonymous',
          photoURL: hostUser.photoURL || '',
          score: 0,
          status: 'host',
        },
      },
    }

    // Set room data
    await set(roomRef, roomData)

    return roomId
  } catch (error) {
    console.error('Error creating room:', error)
    throw new Error(`Failed to create room: ${error.message}`)
  }
}

/**
 * Join an existing room
 * @param {string} roomId - The room ID to join
 * @param {Object} user - The Firebase user object joining the room
 * @param {string} role - The role: 'player' or 'spectator' (default: 'player')
 * @returns {Promise<{success: boolean, role: string, reason?: string}>}
 * @throws {Error} - If room doesn't exist or join fails
 */
export async function joinRoom(roomId, user, role = 'player') {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !user || !user.uid) {
    throw new Error('roomId and user with uid are required')
  }

  if (role !== 'player' && role !== 'spectator') {
    throw new Error('role must be either "player" or "spectator"')
  }

  try {
    const roomRef = ref(rtdb, `rooms/${roomId}`)

    if (role === 'spectator') {
      // ---- SPECTATOR JOIN (non-transactional) ----
      // Spectators don't affect maxPlayers, so we can keep simpler logic here

      // First confirm the room exists
      const snapshot = await get(roomRef)
      if (!snapshot.exists()) {
        throw new Error('Room does not exist')
      }

      // If user was previously a player, mark them as left and remove from active players list
      const playerRef = ref(rtdb, `rooms/${roomId}/players/${user.uid}`)
      const playerSnapshot = await get(playerRef)
      if (playerSnapshot.exists()) {
        // Mark status as left so other clients can display this
        await update(playerRef, { status: 'left' })
      }

      // Add user to spectators object
      const spectatorRef = ref(rtdb, `rooms/${roomId}/spectators/${user.uid}`)
      await set(spectatorRef, {
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        joinedAt: Date.now(),
      })

      return { success: true, role: 'spectator' }
    } else {
      // ---- PLAYER JOIN (transactional to avoid race conditions) ----

      // Optional: pre-check that room exists to give a clearer error than a generic transaction failure
      const snapshot = await get(roomRef)
      if (!snapshot.exists()) {
        throw new Error('Room does not exist')
      }

      const maxPlayersFromRoom = snapshot.val()?.maxPlayers
      const MAX_PLAYERS_FALLBACK = 4

      const transactionResult = await runTransaction(roomRef, (roomData) => {
        // If the room was deleted between the pre-check and now, abort
        if (roomData === null) {
          return roomData
        }

        if (!roomData.players) {
          roomData.players = {}
        }

        const existingPlayer = roomData.players[user.uid]
        const maxPlayers = roomData.maxPlayers || maxPlayersFromRoom || MAX_PLAYERS_FALLBACK

        // Count active players (those who haven't left/resigned)
        const activePlayerCount = Object.values(roomData.players).filter((player) => {
          if (!player) return false
          return player.status !== 'left' && player.status !== 'resigned'
        }).length

        // If the user is not already a player and the room is full, don't add them
        if (!existingPlayer && activePlayerCount >= maxPlayers) {
          // Return the current data unchanged – transaction will still commit,
          // but the caller can detect that the user was not added
          return roomData
        }

        // Either (a) user is rejoining, or (b) there was room to add them
        roomData.players[user.uid] = {
          displayName: user.displayName || 'Anonymous',
          photoURL: user.photoURL || '',
          score: existingPlayer?.score ?? 0,
          status: existingPlayer?.status && existingPlayer.status !== 'left' && existingPlayer.status !== 'resigned'
            ? existingPlayer.status
            : 'coding',
          code: existingPlayer?.code ?? '',
          progress: existingPlayer?.progress ?? 0,
          flags: existingPlayer?.flags ?? [],
          correctAnswers: existingPlayer?.correctAnswers ?? 0,
          theoryAnswers: existingPlayer?.theoryAnswers ?? {},
        }

        return roomData
      })

      const finalRoom = transactionResult.snapshot?.val()
      const isNowPlayer =
        !!finalRoom &&
        !!finalRoom.players &&
        !!finalRoom.players[user.uid] &&
        finalRoom.players[user.uid].status !== 'left'

      if (!isNowPlayer) {
        // Transaction succeeded but user was not added => room was full
        return { success: false, role: 'player', reason: 'full' }
      }

      return { success: true, role: 'player' }
    }
  } catch (error) {
    console.error('Error joining room:', error)
    throw new Error(`Failed to join room: ${error.message}`)
  }
}

/**
 * Start a match in a room
 * @param {string} roomId - The room ID
 * @param {string} matchType - The match type: "coding" or "theory"
 * @param {Object} gamePayload - Payload containing game-specific data
 *   - For theory: { questions: Array, category: string }
 *   - For coding: { problemId: string }
 * @returns {Promise<void>}
 * @throws {Error} - If room doesn't exist or start fails
 */
export async function startMatch(roomId, matchType = 'coding', gamePayload = {}) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId) {
    throw new Error('roomId is required')
  }

  try {
    const roomRef = ref(rtdb, `rooms/${roomId}`)

    // Check if room exists
    const snapshot = await get(roomRef)

    if (!snapshot.exists()) {
      throw new Error('Room does not exist')
    }

    const roomData = snapshot.val()
    console.log('Current room data before update:', roomData)

    // Base room update data
    const updateData = {
      status: 'playing',
      matchType: matchType,
      startTime: serverTimestamp(), // Use server timestamp for sync across all clients
    }
    
    // For theory race, save questions and set win condition
    if (matchType === 'theory') {
      if (!gamePayload.questions || !Array.isArray(gamePayload.questions)) {
        throw new Error('gamePayload.questions array is required for theory matches')
      }

      // Save questions to gameData/questions so all players see the same list
      updateData.gameData = {
        questions: gamePayload.questions,
      }
      
      updateData.currentProblemId = gamePayload.category || 'cpp'
      updateData.currentQuestionIndex = 0
      updateData.questionsAnswered = {}
      
      // Set win condition: first to 10 correct answers, or total questions if less than 10
      const questionCount = gamePayload.questions.length
      updateData.winCondition = Math.min(10, questionCount)
    } else {
      // For coding matches
      if (!gamePayload.problemId) {
        throw new Error('gamePayload.problemId is required for coding matches')
      }
      updateData.currentProblemId = gamePayload.problemId
    }
    
    // Reset all player progress for the new match to avoid stale data
    const resetPlayers = {}
    if (roomData.players) {
      Object.keys(roomData.players).forEach((uid) => {
        resetPlayers[`players/${uid}/correctAnswers`] = 0
        resetPlayers[`players/${uid}/theoryAnswers`] = {}
        resetPlayers[`players/${uid}/currentQuestionIndex`] = 0
        resetPlayers[`players/${uid}/lastCorrectAt`] = null
        resetPlayers[`players/${uid}/status`] = 'coding'
      })
    }

    console.log('Updating room with:', { ...updateData, ...resetPlayers })
    await update(roomRef, { ...updateData, ...resetPlayers })
    console.log('Room updated successfully')
  } catch (error) {
    console.error('Error starting match:', error)
    throw new Error(`Failed to start match: ${error.message}`)
  }
}

/**
 * Submit a theory question answer
 * @param {string} roomId - The room ID
 * @param {string} userId - The user's Firebase UID
 * @param {string} questionId - The question ID
 * @param {number} answerIndex - The selected answer index
 * @param {boolean} isCorrect - Whether the answer is correct
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function submitTheoryAnswer(roomId, userId, questionId, answerIndex, isCorrect) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId || !questionId) {
    throw new Error('roomId, userId, and questionId are required')
  }

  try {
    const answerRef = ref(rtdb, `rooms/${roomId}/players/${userId}/theoryAnswers/${questionId}`)
    await set(answerRef, {
      answerIndex,
      isCorrect,
      timestamp: serverTimestamp(),
    })

    // Update player's correct count if answer is correct
    if (isCorrect) {
      const playerRef = ref(rtdb, `rooms/${roomId}/players/${userId}`)
      const snapshot = await get(playerRef)
      const currentCorrect = snapshot.val()?.correctAnswers || 0
      
      // Update both correctAnswers count and lastCorrectAt timestamp for tie-breaking
      // Use serverTimestamp() so all clients have the same reference point
      await update(playerRef, { 
        correctAnswers: currentCorrect + 1,
        lastCorrectAt: serverTimestamp() // Server timestamp for accurate tie-breaking
      })
    }
  } catch (error) {
    console.error('Error submitting theory answer:', error)
    throw new Error(`Failed to submit theory answer: ${error.message}`)
  }
}

/**
 * Mark a player as having left an active match
 * Implements "Victory by Forfeit" logic: if only 1 player remains active, they win automatically
 * @param {string} roomId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function leaveMatch(roomId, userId) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId) {
    throw new Error('roomId and userId are required')
  }

  try {
    const roomRef = ref(rtdb, `rooms/${roomId}`)
    
    // Get current room data
    const snapshot = await get(roomRef)
    if (!snapshot.exists()) {
      throw new Error('Room does not exist')
    }

    const roomData = snapshot.val()
    const updates = {}

    // Mark the leaving player as 'left' or 'resigned'
    const playerRef = ref(rtdb, `rooms/${roomId}/players/${userId}`)
    const playerStatus = roomData.status === 'playing' ? 'resigned' : 'left'
    updates[`players/${userId}/status`] = playerStatus

    // Victory by Forfeit: Check if match is active and if only 1 active player remains
    if (roomData.status === 'playing' && roomData.players) {
      // Count active players (excluding the one who is leaving)
      const activePlayers = Object.entries(roomData.players).filter(
        ([uid, player]) => uid !== userId && player.status !== 'left' && player.status !== 'resigned'
      )

      // If only 1 player remains active, they win by default
      if (activePlayers.length === 1) {
        const [remainingPlayerId, remainingPlayer] = activePlayers[0]
        updates[`players/${remainingPlayerId}/status`] = 'success'
        
        // Also update room status to indicate match ended (Last Man Standing)
        updates.status = 'finished'
      }
    }

    // Apply all updates atomically
    await update(roomRef, updates)
  } catch (error) {
    console.error('Error leaving match:', error)
    throw new Error(`Failed to leave match: ${error.message}`)
  }
}

/**
 * Remove a spectator from a room
 * @param {string} roomId - The room ID
 * @param {string} userId - The user ID of the spectator to remove
 * @returns {Promise<void>}
 * @throws {Error} - If removal fails
 */
export async function removeSpectator(roomId, userId) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId) {
    throw new Error('roomId and userId are required')
  }

  try {
    const spectatorRef = ref(rtdb, `rooms/${roomId}/spectators/${userId}`)
    await set(spectatorRef, null) // Remove the spectator entry
  } catch (error) {
    console.error('Error removing spectator:', error)
    throw new Error(`Failed to remove spectator: ${error.message}`)
  }
}

/**
 * Reset match state for next challenge
 * @param {string} roomId - The room ID
 * @returns {Promise<void>}
 * @throws {Error} - If reset fails
 */
export async function resetMatch(roomId) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId) {
    throw new Error('roomId is required')
  }

  try {
    const roomRef = ref(rtdb, `rooms/${roomId}`)
    
    // Reset all players' status and scores
    const snapshot = await get(roomRef)
    if (!snapshot.exists()) return

    const roomData = snapshot.val()
    const updates = {}

    // Reset room-level match state
    updates.status = 'waiting'
    updates.currentProblemId = null
    updates.startTime = null
    updates.currentQuestionIndex = null
    updates.questionsAnswered = null
    updates.winCondition = null // Reset win condition for theory race
    updates.gameData = null // Clear gameData/questions for next round

    // Reset each player's state
    if (roomData.players) {
      Object.keys(roomData.players).forEach((uid) => {
        updates[`players/${uid}/status`] = null
        updates[`players/${uid}/code`] = null
        updates[`players/${uid}/correctAnswers`] = 0
        updates[`players/${uid}/theoryAnswers`] = null
        updates[`players/${uid}/lastCorrectAt`] = null // Reset tie-breaking timestamp
        updates[`players/${uid}/currentQuestionIndex`] = null // Reset question index
      })
    }

    await update(roomRef, updates)
  } catch (error) {
    console.error('Error resetting match:', error)
    throw new Error(`Failed to reset match: ${error.message}`)
  }
}

/**
 * Update a player's status in a room
 * @param {string} roomId - The room ID
 * @param {string} userId - The user's Firebase UID
 * @param {string} status - The new status (e.g., "coding", "compiling", "success", "failed")
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function updatePlayerStatus(roomId, userId, status) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId || !status) {
    throw new Error('roomId, userId, and status are required')
  }

  try {
    const playerStatusRef = ref(rtdb, `rooms/${roomId}/players/${userId}/status`)
    await set(playerStatusRef, status)
  } catch (error) {
    console.error('Error updating player status:', error)
    throw new Error(`Failed to update player status: ${error.message}`)
  }
}

/**
 * Update a player's progress in a room
 * @param {string} roomId - The room ID
 * @param {string} userId - The user's Firebase UID
 * @param {number} progress - Progress value (0-100 integer)
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function updatePlayerProgress(roomId, userId, progress) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId || progress === undefined) {
    throw new Error('roomId, userId, and progress are required')
  }

  if (progress < 0 || progress > 100) {
    throw new Error('Progress must be between 0 and 100')
  }

  try {
    const playerProgressRef = ref(rtdb, `rooms/${roomId}/players/${userId}/progress`)
    await set(playerProgressRef, Math.round(progress))
  } catch (error) {
    console.error('Error updating player progress:', error)
    throw new Error(`Failed to update player progress: ${error.message}`)
  }
}

/**
 * Update a player's code in a room
 * @param {string} roomId - The room ID
 * @param {string} userId - The user's Firebase UID
 * @param {string} code - The source code
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function updatePlayerCode(roomId, userId, code) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId || code === undefined) {
    throw new Error('roomId, userId, and code are required')
  }

  try {
    const playerRef = ref(rtdb, `rooms/${roomId}/players/${userId}`)
    // Use update() to only update the code field, preserving other fields like score
    await update(playerRef, { code })
  } catch (error) {
    console.error('Error updating player code:', error)
    throw new Error(`Failed to update player code: ${error.message}`)
  }
}

/**
 * Flag suspicious activity for a player
 * @param {string} roomId - The room ID
 * @param {string} userId - The user's Firebase UID
 * @param {string} type - The type of suspicious activity (e.g., "Paste Detected")
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function flagSuspiciousActivity(roomId, userId, type) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId || !type) {
    throw new Error('roomId, userId, and type are required')
  }

  try {
    const flagsRef = ref(rtdb, `rooms/${roomId}/players/${userId}/flags`)
    const newFlagRef = push(flagsRef)
    await set(newFlagRef, type)
  } catch (error) {
    console.error('Error flagging suspicious activity:', error)
    throw new Error(`Failed to flag suspicious activity: ${error.message}`)
  }
}

/**
 * Update a player's current question index
 * @param {string} roomId - The room ID
 * @param {string} userId - The user's Firebase UID
 * @param {number} index - The current question index
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function updatePlayerQuestionIndex(roomId, userId, index) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !userId || index === undefined) {
    throw new Error('roomId, userId, and index are required')
  }

  try {
    const playerRef = ref(rtdb, `rooms/${roomId}/players/${userId}/currentQuestionIndex`)
    await set(playerRef, index)
  } catch (error) {
    console.error('Error updating player question index:', error)
    throw new Error(`Failed to update player question index: ${error.message}`)
  }
}

/**
 * Subscribe to real-time updates for a room
 * @param {string} roomId - The room ID to subscribe to
 * @param {Function} callback - Callback function that receives room data whenever it changes
 * @returns {Function} - Unsubscribe function to stop listening
 */
export function subscribeToRoom(roomId, callback) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId) {
    throw new Error('roomId is required')
  }

  if (typeof callback !== 'function') {
    throw new Error('callback must be a function')
  }

  const roomRef = ref(rtdb, `rooms/${roomId}`)

  // Set up real-time listener and return unsubscribe function
  return onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      const roomData = snapshot.val()
      callback(roomData)
    } else {
      callback(null)
    }
  })
}

