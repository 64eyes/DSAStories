/**
 * Rating Service
 * Handles Elo rating calculations and user stats updates
 */

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

/**
 * Rank titles based on Elo rating
 */
const RANK_TITLES = {
  NOVICE: 'Novice', // < 1200
  APPELLANT: 'Appellant', // 1200 - 1499
  ENGINEER: 'Engineer', // 1500 - 1799
  ARCHITECT: 'Architect', // 1800 - 2099
  GRANDMASTER: 'Grandmaster', // >= 2100
}

/**
 * Get rank title based on Elo rating
 * @param {number} elo - The user's Elo rating
 * @returns {string} - The rank title
 */
function getRankTitle(elo) {
  if (elo < 1200) {
    return RANK_TITLES.NOVICE
  } else if (elo < 1500) {
    return RANK_TITLES.APPELLANT
  } else if (elo < 1800) {
    return RANK_TITLES.ENGINEER
  } else if (elo < 2100) {
    return RANK_TITLES.ARCHITECT
  } else {
    return RANK_TITLES.GRANDMASTER
  }
}

/**
 * Calculate Elo rating change based on rank in match
 * @param {number} currentElo - The user's current Elo rating
 * @param {number} rank - The user's rank in the match (1 = 1st place, 2 = 2nd place, etc.)
 * @param {number} totalPlayers - Total number of players in the match
 * @returns {number} - The rating change (positive for gains, negative for losses)
 */
export function calculateRatingChange(currentElo, rank, totalPlayers) {
  if (rank < 1 || rank > totalPlayers || totalPlayers < 2) {
    throw new Error('Invalid rank or totalPlayers. Rank must be between 1 and totalPlayers, and totalPlayers must be at least 2.')
  }

  // Base rating change based on rank position
  // 1st place: +30, last place: -20
  // Linear interpolation for positions in between
  const baseChange = rank === 1 
    ? 30  // First place: +30
    : rank === totalPlayers
    ? -20 // Last place: -20
    : 30 - (50 * (rank - 1) / (totalPlayers - 1)) // Linear interpolation

  let ratingChange = baseChange

  // Novice Protection: If currentElo < 1200, losses are halved or zero
  if (currentElo < 1200 && ratingChange < 0) {
    // Halve losses for novices, minimum loss is 0
    ratingChange = Math.max(0, Math.floor(ratingChange / 2))
  }

  // Diminishing Returns: If currentElo > 2000, gains are halved (harder to climb at the top)
  if (currentElo > 2000 && ratingChange > 0) {
    ratingChange = Math.floor(ratingChange / 2)
  }

  // Return integer change
  return Math.round(ratingChange)
}

/**
 * Update user stats in Firestore after a match
 * @param {string} userId - The user's Firebase UID
 * @param {boolean} isWin - Whether the user won the match (true if rank === 1)
 * @param {number} ratingChange - The rating change calculated by calculateRatingChange
 * @returns {Promise<{newElo: number, newRank: string}>} - The updated Elo and rank
 */
export async function updateUserStats(userId, isWin, ratingChange) {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }

  if (!userId) {
    throw new Error('userId is required')
  }

  try {
    const userRef = doc(db, 'users', userId)
    
    // Get current user data
    const userDoc = await getDoc(userRef)
    
    const currentData = userDoc.exists() ? userDoc.data() : {}
    const currentElo = currentData.elo || 1200
    const currentMatchesPlayed = currentData.matchesPlayed || 0
    const currentWins = currentData.wins || 0
    
    // Calculate new values
    const newElo = currentElo + ratingChange
    const newRank = getRankTitle(newElo)
    const newMatchesPlayed = currentMatchesPlayed + 1
    const newWins = isWin ? currentWins + 1 : currentWins

    // Update user document
    // Use setDoc with merge to create document if it doesn't exist
    await setDoc(userRef, {
      elo: newElo,
      rank: newRank,
      matchesPlayed: newMatchesPlayed,
      wins: newWins,
      lastUpdated: new Date().toISOString(),
    }, { merge: true })

    return {
      newElo,
      newRank,
    }
  } catch (error) {
    console.error('Error updating user stats:', error)
    throw new Error(`Failed to update user stats: ${error.message}`)
  }
}

