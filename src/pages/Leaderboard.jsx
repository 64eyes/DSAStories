import React, { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'

function Leaderboard() {
  const { currentUser } = useAuth()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getLeaderboard(50)
        if (isMounted) {
          setPlayers(data)
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load leaderboard')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const isEmpty = !loading && players.length === 0

  return (
    <div className="min-h-[60vh] rounded-2xl border border-white/10 bg-neutral-950/80 p-4 shadow-xl sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Hall of Fame
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Global Elo rankings. Top 50 memory-safe gladiators in the Arena.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Empty / Loading State */}
      {loading && players.length === 0 && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex animate-pulse items-center gap-4 rounded-lg border border-white/5 bg-white/5 px-4 py-3"
            >
              <div className="h-5 w-6 rounded bg-white/10" />
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="hidden h-4 w-24 rounded bg-white/10 sm:block" />
              <div className="ml-auto flex gap-3">
                <div className="h-4 w-14 rounded bg-white/10" />
                <div className="h-4 w-16 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
          <p className="text-sm sm:text-base">No rankings yet. Be the first to ascend the ladder.</p>
        </div>
      )}

      {!isEmpty && players.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-900/60">
          <table className="min-w-full text-left text-sm text-neutral-300">
            <thead className="border-b border-white/10 bg-neutral-900/80 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 text-right">Elo</th>
                <th className="px-4 py-3 text-right">Matches</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                const isCurrentUser = currentUser && currentUser.uid === player.id
                const rankNumber = index + 1
                const rowClasses = isCurrentUser
                  ? 'bg-red-900/40 border-red-600/60'
                  : 'border-white/5 odd:bg-neutral-900/40 even:bg-neutral-900/10'

                return (
                  <tr key={player.id} className={`border-b ${rowClasses}`}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-neutral-400 sm:text-sm">
                      #{rankNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 sm:h-10 sm:w-10">
                          <img
                            src={player.photoURL || '/default-avatar.png'}
                            alt={player.displayName || 'Player'}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                player.displayName || 'Player',
                              )}&background=dc2626&color=fff&size=64`
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="max-w-[140px] truncate text-sm font-semibold text-white sm:max-w-[200px]">
                              {player.displayName || 'Anonymous'}
                            </span>
                            <span className="text-base" title="Nationality">
                              {player.nationality || '🇺🇳'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-neutral-300 sm:text-sm">
                      {player.title || 'Novice'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-amber-300">
                      {player.elo}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-neutral-400 sm:text-sm">
                      {player.matchesPlayed}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Leaderboard


