import { Share2 } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'

function Arena() {
  const handleShareRoom = () => {
    // Dummy function for now
    alert('Share Room functionality coming soon!')
  }

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-white">
      {/* Minimalist Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-neutral-950/60 px-6 py-4 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-white">The Arena</h1>
        <button
          onClick={handleShareRoom}
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10"
        >
          <Share2 size={16} />
          <span>Share Room</span>
        </button>
      </header>

      {/* Code Editor Container */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full">
          <CodeEditor />
        </div>
      </div>
    </div>
  )
}

export default Arena

