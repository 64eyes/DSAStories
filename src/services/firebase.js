import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Initialize Firebase with error handling
let app = null
let auth = null
let db = null

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
  } catch (error) {
    console.error('Firebase initialization error:', error)
    // Continue without Firebase - app should still work
  }
} else {
  console.warn('Firebase config not found. Auth features will be disabled.')
}

export { auth, db }

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

export default app

