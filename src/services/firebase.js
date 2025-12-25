import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
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
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
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
 * Update user profile in Firestore
 * @param {string} uid - The user's Firebase UID
 * @param {Object} data - The profile data to update (e.g., { nationality, displayName, elo, rank })
 * @returns {Promise<void>}
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
    await setDoc(userRef, data, { merge: true })
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error(`Failed to update user profile: ${error.message}`)
  }
}

/**
 * Get user profile from Firestore
 * @param {string} uid - The user's Firebase UID
 * @returns {Promise<Object>} - User profile data with defaults if document doesn't exist
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
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      return userDoc.data()
    } else {
      // Return default profile for new users
      return {
        elo: 1200,
        rank: 'Novice',
        nationality: '🇺🇳',
      }
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw new Error(`Failed to get user profile: ${error.message}`)
  }
}

export default app

