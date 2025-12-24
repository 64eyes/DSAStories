import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let timeout
    try {
      if (!auth) {
        // Firebase not initialized, render immediately
        setLoading(false)
        return
      }

      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user)
          setLoading(false)
        },
        (error) => {
          console.error('Auth state error:', error)
          setLoading(false) // Still render even if auth fails
        },
      )

      // Fallback timeout in case Firebase never responds
      timeout = setTimeout(() => {
        setLoading(false)
        console.warn('Auth initialization timeout, rendering anyway')
      }, 2000)

      return () => {
        unsubscribe()
        if (timeout) clearTimeout(timeout)
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setLoading(false) // Render anyway
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  const value = {
    currentUser,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

