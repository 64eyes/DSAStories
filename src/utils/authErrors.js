/**
 * Maps Firebase Auth error codes to user-friendly messages
 * @param {Error} error - The Firebase error object
 * @returns {string} - User-friendly error message
 */
export function getAuthErrorMessage(error) {
  if (!error || !error.code) {
    return 'An unexpected error occurred. Please try again.'
  }

  const errorCode = error.code

  // Firebase Auth error code mappings
  const errorMessages = {
    // Invalid credentials
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    
    // Sign up errors
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    
    // Network errors
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    
    // Account disabled
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    
    // Generic errors
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/invalid-action-code': 'Invalid verification code. The link may have expired.',
    'auth/expired-action-code': 'This verification link has expired. Please request a new one.',
  }

  // Return user-friendly message or fallback to a generic message
  return errorMessages[errorCode] || `Authentication failed: ${error.message || errorCode}. Please try again.`
}


