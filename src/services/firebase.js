import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  limit as limitDocs,
  query,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

// Initialize Firebase with error handling
let app = null
let auth = null
let db = null
let rtdb = null

// Check if Firebase config is available before initializing
const hasFirebaseConfig =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN

if (hasFirebaseConfig) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }

    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    rtdb = getDatabase(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
    // Continue without Firebase - app should still work
  }
} else {
  console.warn('Firebase config not found. Auth features will be disabled.')
}

export { auth, db, rtdb }

/**
 * Sign in with Google
 * @returns {Promise<UserCredential>}
 */
export async function signInWithGoogle() {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.')
  }
  try {
    const googleProvider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, googleProvider)
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function logOut() {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.')
  }
  try {
    await signOut(auth)
  } catch (error) {
    throw error
  }
}

/**
 * Get user profile from Firestore
 * @param {string} uid - The user's Firebase UID
 * @returns {Promise<Object>} - User profile data with sensible defaults
 */
export async function getUserProfile(uid) {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }

  if (!uid) {
    throw new Error('uid is required')
  }

  try {
    const userRef = doc(db, 'users', uid)
    const snap = await getDoc(userRef)

    if (!snap.exists()) {
      // Default profile for new users
      return {
        elo: 1200,
        rank: 'Novice',
        wins: 0,
        nationality: 'UN',
      }
    }

    const data = snap.data() || {}
    return {
      elo: typeof data.elo === 'number' ? data.elo : 1200,
      rank: data.rank || 'Novice',
      wins: typeof data.wins === 'number' ? data.wins : 0,
      nationality: data.nationality || 'UN',
      ...data,
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw new Error(error.message || 'Failed to load profile')
  }
}

/**
 * Update user profile in Firestore
 * @param {string} uid - The user's Firebase UID
 * @param {Object} data - Partial profile data to merge
 */
export async function updateUserProfile(uid, data) {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }

  if (!uid) {
    throw new Error('uid is required')
  }

  try {
    const userRef = doc(db, 'users', uid)
    await setDoc(
      userRef,
      {
        ...data,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error(error.message || 'Failed to update profile')
  }
}

/**
 * Fetch global leaderboard from Firestore
 * - Reads from the "users" collection
 * - Orders by "elo" descending
 * - Limits to top 50 (or a custom limit)
 */
export async function getLeaderboard(maxResults = 50) {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
  }

  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('elo', 'desc'), limitDocs(maxResults))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc, index) => {
      const data = doc.data() || {}
      return {
        id: doc.id,
        rank: index + 1,
        displayName: data.displayName || 'Anonymous',
        photoURL: data.photoURL || '',
        nationality: data.nationality || '🇺🇳',
        title: data.title || data.rank || 'Novice',
        elo: typeof data.elo === 'number' ? data.elo : 1200,
        matchesPlayed: typeof data.matchesPlayed === 'number' ? data.matchesPlayed : 0,
      }
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    throw new Error(error.message || 'Failed to load leaderboard')
  }
}

export default app

