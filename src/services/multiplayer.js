/**
 * Multiplayer Service
 * Handles real-time multiplayer game rooms using Firebase Realtime Database
 */

import { ref, set, get, onValue, update, push, child, serverTimestamp } from 'firebase/database'
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
 * @returns {Promise<{success: boolean}>}
 * @throws {Error} - If room doesn't exist or join fails
 */
export async function joinRoom(roomId, user) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !user || !user.uid) {
    throw new Error('roomId and user with uid are required')
  }

  try {
    const roomRef = ref(rtdb, `rooms/${roomId}`)

    // Check if room exists
    const snapshot = await get(roomRef)

    if (!snapshot.exists()) {
      throw new Error('Room does not exist')
    }

    // Add user to players object
    const playerRef = ref(rtdb, `rooms/${roomId}/players/${user.uid}`)
    await set(playerRef, {
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL || '',
      score: 0,
    })

    return { success: true }
  } catch (error) {
    console.error('Error joining room:', error)
    throw new Error(`Failed to join room: ${error.message}`)
  }
}

/**
 * Start a match in a room
 * @param {string} roomId - The room ID
 * @param {string} problemId - The problem/chapter ID (e.g., "1-20") or category for theory race
 * @param {string} matchType - The match type: "coding" or "theory"
 * @param {number} questionCount - Optional: Number of questions for theory race (used to set winCondition)
 * @returns {Promise<void>}
 * @throws {Error} - If room doesn't exist or start fails
 */
export async function startMatch(roomId, problemId, matchType = 'coding', questionCount = null) {
  if (!rtdb) {
    throw new Error('Realtime Database is not initialized. Please check your Firebase configuration.')
  }

  if (!roomId || !problemId) {
    throw new Error('roomId and problemId are required')
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

    // Update room status to playing
    const updateData = {
      status: 'playing',
      matchType: matchType,
      currentProblemId: problemId,
      startTime: serverTimestamp(), // Use server timestamp for sync across all clients
    }
    
    // For theory race, initialize question tracking and set win condition
    if (matchType === 'theory') {
      updateData.currentQuestionIndex = 0
      updateData.questionsAnswered = {}
      
      // Set win condition: first to 10 correct answers, or total questions if less than 10
      if (questionCount && questionCount > 0) {
        updateData.winCondition = Math.min(10, questionCount)
      } else {
        // Default to 10 if questionCount not provided
        updateData.winCondition = 10
      }
    }
    
    console.log('Updating room with:', updateData)
    await update(roomRef, updateData)
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
      timestamp: Date.now(),
    })

    // Update player's correct count if answer is correct
    if (isCorrect) {
      const playerRef = ref(rtdb, `rooms/${roomId}/players/${userId}`)
      const snapshot = await get(playerRef)
      const currentCorrect = snapshot.val()?.correctAnswers || 0
      const timestamp = Date.now()
      
      // Update both correctAnswers count and lastCorrectAt timestamp for tie-breaking
      await update(playerRef, { 
        correctAnswers: currentCorrect + 1,
        lastCorrectAt: timestamp // Timestamp of when this correct answer was submitted
      })
    }
  } catch (error) {
    console.error('Error submitting theory answer:', error)
    throw new Error(`Failed to submit theory answer: ${error.message}`)
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

    // Reset each player's state
    if (roomData.players) {
      Object.keys(roomData.players).forEach((uid) => {
        updates[`players/${uid}/status`] = null
        updates[`players/${uid}/code`] = null
        updates[`players/${uid}/correctAnswers`] = 0
        updates[`players/${uid}/theoryAnswers`] = null
        updates[`players/${uid}/lastCorrectAt`] = null // Reset tie-breaking timestamp
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

