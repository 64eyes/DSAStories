import { useState, useEffect, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Loader2 } from 'lucide-react'
import { executeCode } from '../services/judge0'

const DEFAULT_CODE = `#include <iostream>

int main() {
    int* ptr = new int(42);
    std::cout << "Hello, World!" << std::endl;
    std::cout << "Pointer value: " << *ptr << std::endl;
    
    delete ptr;
    return 0;
}`

function CodeEditor({ initialCode, onSuccess, onRunStart, onError, onCodeChange, onSuspiciousActivity, readOnly = false, testCaseInput = '' }) {
  const [code, setCode] = useState(initialCode || DEFAULT_CODE)
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [stats, setStats] = useState(null)
  const [showPasteWarning, setShowPasteWarning] = useState(false)
  const editorRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Reset editor code when initialCode changes (e.g., navigating to next chapter)
  useEffect(() => {
    setCode(initialCode || DEFAULT_CODE)
    // Also reset output state so previous level's result doesn't linger
    setOutput('')
    setIsError(false)
    setStats(null)
  }, [initialCode])

  // Debounced code change handler
  const debouncedCodeChange = useCallback((newCode) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      if (onCodeChange && typeof onCodeChange === 'function') {
        onCodeChange(newCode)
      }
    }, 500)
  }, [onCodeChange])

  // Handle code changes
  const handleCodeChange = (value) => {
    const newCode = value || ''
    setCode(newCode)
    
    // Broadcast code changes (debounced) if not read-only
    if (!readOnly && onCodeChange) {
      debouncedCodeChange(newCode)
    }
  }

  // Handle Monaco editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor

    // Add paste detection listener
    if (!readOnly) {
      editor.onDidPaste((e) => {
        const pastedText = e.text || ''
        const pastedLength = pastedText.length

        // If pasted content is longer than 20 characters, flag as suspicious
        if (pastedLength > 20) {
          // Visual warning: flash red border
          setShowPasteWarning(true)
          setTimeout(() => setShowPasteWarning(false), 2000)

          // Call suspicious activity callback
          if (onSuspiciousActivity && typeof onSuspiciousActivity === 'function') {
            onSuspiciousActivity('paste')
          }
        }
      })
    }
  }

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleRun = async () => {
    setIsLoading(true)
    setIsError(false)
    setOutput('')
    setStats(null)

    // Call onRunStart callback if provided
    if (onRunStart && typeof onRunStart === 'function') {
      onRunStart()
    }

    try {
      const result = await executeCode(code, testCaseInput)

      // Judge0 status codes:
      // 1: In Queue, 2: Processing, 3: Accepted, 4: Wrong Answer
      // 5: Time Limit Exceeded, 6: Compilation Error, 7: Runtime Error (SIGSEGV, etc.)
      // 8: Runtime Error (NZEC), 9: Runtime Error (Other), 10: Internal Error, 11: Exec Format Error

      const status = result.status?.id || result.status_id
      const statusDescription = result.status?.description || result.status_description || ''

      // Extract stats if available
      if (result.time || result.memory) {
        setStats({
          time: result.time,
          memory: result.memory,
        })
      }

      // Handle different error types based on status
      if (status === 6 || result.compile_output) {
        // Compilation Error
        setIsError(true)
        let errorMsg = result.compile_output || 'Compilation error occurred'
        if (statusDescription) {
          errorMsg = `${statusDescription}\n\n${errorMsg}`
        }
        setOutput(errorMsg)
        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMsg)
        }
      } else if (status === 5) {
        // Time Limit Exceeded
        setIsError(true)
        const errorMsg = `⏱️ Time Limit Exceeded\n\nYour program exceeded the time limit.\n${statusDescription || 'Execution was terminated due to timeout.'}`
        setOutput(errorMsg)
        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMsg)
        }
      } else if (status === 7 || status === 8 || status === 9) {
        // Runtime Errors (SIGSEGV, NZEC, Other)
        setIsError(true)
        let errorMsg = ''
        
        if (result.stderr) {
          errorMsg = result.stderr
        } else if (result.message) {
          errorMsg = result.message
        } else {
          errorMsg = statusDescription || 'Runtime error occurred'
        }

        // Add status description if available
        if (statusDescription && !errorMsg.includes(statusDescription)) {
          errorMsg = `${statusDescription}\n\n${errorMsg}`
        }

        // Add helpful context for common runtime errors
        if (status === 7) {
          errorMsg = `💥 Runtime Error (SIGSEGV/SIGFPE/SIGABRT)\n\n${errorMsg}\n\nCommon causes: Segmentation fault, division by zero, or abort signal.`
        } else if (status === 8) {
          errorMsg = `❌ Runtime Error (Non-Zero Exit Code)\n\n${errorMsg}\n\nYour program exited with a non-zero status code.`
        }

        setOutput(errorMsg)
        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMsg)
        }
      } else if (status === 10) {
        // Internal Error
        setIsError(true)
        const errorMsg = `⚠️ Internal Error\n\n${statusDescription || 'An internal error occurred. Please try again.'}`
        setOutput(errorMsg)
        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMsg)
        }
      } else if (status === 11) {
        // Exec Format Error
        setIsError(true)
        const errorMsg = `⚠️ Execution Format Error\n\n${statusDescription || 'Invalid executable format.'}`
        setOutput(errorMsg)
        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMsg)
        }
      } else if (result.stderr) {
        // Other stderr output (treat as error)
        setIsError(true)
        setOutput(result.stderr)
        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(result.stderr)
        }
      } else if (result.stdout !== null && result.stdout !== undefined) {
        // Success - stdout (can be empty string, which is valid)
        setIsError(false)
        const stdout = result.stdout || ''
        setOutput(stdout || '(Program executed successfully with no output)')
        
        // Call onSuccess callback if provided (for answer verification)
        // Pass both output and source code for syntax checking
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(stdout, code)
        }
      } else if (status === 3) {
        // Accepted (success with no output)
        setIsError(false)
        setOutput('✓ Program executed successfully')
        
        // Call onSuccess callback if provided
        // Pass both output and source code for syntax checking
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess('', code)
        }
      } else {
        // Unknown status or no output
        setIsError(true)
        const errorMsg = statusDescription || `Unknown status: ${status}\nNo output received from the program.`
        setOutput(errorMsg)
        // Call onError callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMsg)
        }
      }
    } catch (error) {
      setIsError(true)
      const errorMsg = error.message || 'Failed to execute code'
      setOutput(errorMsg)
      // Call onError callback if provided
      if (onError && typeof onError === 'function') {
        onError(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-xl border transition-all ${
      showPasteWarning 
        ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
        : 'border-white/10'
    } ${readOnly ? 'bg-neutral-900/50' : 'bg-neutral-900'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-neutral-950/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-neutral-400">main.cpp</span>
          {readOnly && (
            <span className="text-xs text-neutral-500">(Read-Only)</span>
          )}
        </div>
        {!readOnly && (
          <button
            onClick={handleRun}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors active:scale-95 sm:px-4 ${
              isLoading
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Run</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Editor and Output Container */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r">
          <Editor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 12, // Smaller on mobile
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              readOnly: readOnly,
              // Mobile-friendly options
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
            }}
          />
        </div>

        {/* Output Console */}
        <div className="flex h-48 flex-col overflow-hidden bg-neutral-950 sm:h-64 lg:h-auto lg:w-96">
          <div className="border-b border-white/10 bg-neutral-900/60 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Output
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {output ? (
              <pre
                className={`font-mono text-sm whitespace-pre-wrap ${
                  isError ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {output}
              </pre>
            ) : (
              <p className="font-mono text-sm text-neutral-500">
                Click "Run" to execute your code...
              </p>
            )}
          </div>
          {stats && (
            <div className="border-t border-white/10 bg-neutral-900/60 px-4 py-2">
              <div className="flex items-center gap-4 text-xs text-neutral-400">
                {stats.time && (
                  <span className="font-mono">Time: {stats.time}s</span>
                )}
                {stats.memory && (
                  <span className="font-mono">
                    Memory: {Math.round(stats.memory / 1024)}KB
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeEditor

