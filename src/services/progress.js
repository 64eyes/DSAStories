/**
 * Progress Service
 * Handles user progress tracking in Firestore
 */

import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Unlocks a chapter for a user and awards XP
 * @param {string} userId - The user's Firebase UID
 * @param {string} chapterId - The chapter ID to unlock (e.g., "1-2")
 * @returns {Promise<void>}
 */
export async function unlockChapter(userId, chapterId) {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }

  if (!userId || !chapterId) {
    throw new Error('userId and chapterId are required')
  }

  try {
    const userRef = doc(db, 'users', userId)

    // Check if user document exists
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      // Update existing document
      const currentData = userDoc.data()
      const unlockedChapters = currentData.unlockedChapters || []

      // Only update if chapter is not already unlocked
      if (!unlockedChapters.includes(chapterId)) {
        await updateDoc(userRef, {
          unlockedChapters: arrayUnion(chapterId),
          xp: increment(50),
          lastUpdated: new Date().toISOString(),
        })
      } else {
        // Chapter already unlocked, just update timestamp
        await updateDoc(userRef, {
          lastUpdated: new Date().toISOString(),
        })
      }
    } else {
      // Create new user document
      await setDoc(userRef, {
        unlockedChapters: [chapterId],
        xp: 50,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('Error unlocking chapter:', error)
    throw new Error(`Failed to save progress: ${error.message}`)
  }
}

/**
 * Gets user progress from Firestore
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<{unlockedChapters: string[], xp: number}>}
 */
export async function getUserProgress(userId) {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }

  if (!userId) {
    throw new Error('userId is required')
  }

  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const data = userDoc.data()
      return {
        unlockedChapters: data.unlockedChapters || [],
        xp: data.xp || 0,
      }
    } else {
      // Return default progress for new users
      return {
        unlockedChapters: [],
        xp: 0,
      }
    }
  } catch (error) {
    console.error('Error getting user progress:', error)
    throw new Error(`Failed to get progress: ${error.message}`)
  }
}

