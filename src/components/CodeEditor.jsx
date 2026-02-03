import { useState, useEffect } from 'react'
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

function CodeEditor({ initialCode, onSuccess }) {
  const [code, setCode] = useState(initialCode || DEFAULT_CODE)
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [stats, setStats] = useState(null)

  // Reset editor code when initialCode changes (e.g., navigating to next chapter)
  useEffect(() => {
    setCode(initialCode || DEFAULT_CODE)
    // Also reset output state so previous level's result doesn't linger
    setOutput('')
    setIsError(false)
    setStats(null)
  }, [initialCode])

  const handleRun = async () => {
    setIsLoading(true)
    setIsError(false)
    setOutput('')
    setStats(null)

    try {
      const result = await executeCode(code)

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
      } else if (status === 5) {
        // Time Limit Exceeded
        setIsError(true)
        setOutput(
          `⏱️ Time Limit Exceeded\n\nYour program exceeded the time limit.\n${statusDescription || 'Execution was terminated due to timeout.'}`,
        )
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
      } else if (status === 10) {
        // Internal Error
        setIsError(true)
        setOutput(`⚠️ Internal Error\n\n${statusDescription || 'An internal error occurred. Please try again.'}`)
      } else if (status === 11) {
        // Exec Format Error
        setIsError(true)
        setOutput(`⚠️ Execution Format Error\n\n${statusDescription || 'Invalid executable format.'}`)
      } else if (result.stderr) {
        // Other stderr output (treat as error)
        setIsError(true)
        setOutput(result.stderr)
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
        setOutput(
          statusDescription || `Unknown status: ${status}\nNo output received from the program.`,
        )
      }
    } catch (error) {
      setIsError(true)
      setOutput(error.message || 'Failed to execute code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-neutral-950/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-neutral-400">main.cpp</span>
        </div>
        <button
          onClick={handleRun}
          disabled={isLoading}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            isLoading
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Run</span>
            </>
          )}
        </button>
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
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Output Console */}
        <div className="flex h-64 flex-col overflow-hidden bg-neutral-950 lg:h-auto lg:w-96">
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

