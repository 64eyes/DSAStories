/**
 * Judge0 API Service
 * Handles code execution via RapidAPI Judge0 endpoint
 */

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions'
const C_PLUS_PLUS_LANGUAGE_ID = 54 // C++ GCC 9.2.0

/**
 * Executes C++ code using Judge0 API
 * @param {string} sourceCode - The C++ source code to execute
 * @returns {Promise<Object>} - The submission result with execution details
 * @throws {Error} - If API key is missing or request fails
 */
export async function executeCode(sourceCode) {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY

  if (!apiKey) {
    throw new Error(
      'RapidAPI key is missing. Please set VITE_RAPIDAPI_KEY in your .env file.',
    )
  }

  try {
    // Encode source code to base64
    const encodedSourceCode = btoa(unescape(encodeURIComponent(sourceCode)))
    const encodedStdin = btoa('')

    // Use base64_encoded=true as required by Judge0
    const url = `${JUDGE0_API_URL}?base64_encoded=true&fields=*&wait=true`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': apiKey,
      },
      body: JSON.stringify({
        language_id: C_PLUS_PLUS_LANGUAGE_ID,
        source_code: encodedSourceCode,
        stdin: encodedStdin,
      }),
    })

    if (!response.ok) {
      let errorMessage = `Judge0 API error: ${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        // Judge0 often returns error details in different fields
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        } else {
          // Try to stringify the whole error object for debugging
          errorMessage = `${errorMessage}\nDetails: ${JSON.stringify(errorData, null, 2)}`
        }
      } catch (parseError) {
        // If JSON parsing fails, try to get text response
        const textResponse = await response.text().catch(() => '')
        if (textResponse) {
          errorMessage = `${errorMessage}\nResponse: ${textResponse}`
        }
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    
    // Helper function to decode base64 to UTF-8 string
    const decodeBase64 = (base64String) => {
      if (!base64String) return base64String
      try {
        // Decode base64 to binary string, then convert to UTF-8
        const binaryString = atob(base64String)
        return decodeURIComponent(escape(binaryString))
      } catch (e) {
        // If decoding fails, return as is (might already be decoded)
        return base64String
      }
    }
    
    // Decode base64 fields if they exist
    if (result.stdout) {
      result.stdout = decodeBase64(result.stdout)
    }
    if (result.stderr) {
      result.stderr = decodeBase64(result.stderr)
    }
    if (result.compile_output) {
      result.compile_output = decodeBase64(result.compile_output)
    }
    
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Failed to execute code: ${error.message || 'Unknown error'}`)
  }
}

