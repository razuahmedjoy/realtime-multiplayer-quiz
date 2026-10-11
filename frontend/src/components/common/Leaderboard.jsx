import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'

/** Player rankings. `results` (optional) shows points earned on the last question. */
const Leaderboard = ({ players, limit = 5, highlightId, results }) => {
  if (!players?.length) return <p className="py-4 text-center text-white/40">No players</p>
  return (
    <ol className="space-y-2">
      {players.slice(0, limit).map((p) => (
        <li
          key={p.playerId}
          className={cn('flex items-center gap-3 rounded-xl px-4 py-2.5', p.playerId === highlightId ? 'bg-indigo-500/30 ring-1 ring-indigo-400' : 'bg-white/5')}
        >
          <span className={cn('w-6 text-center font-bold', p.rank <= 3 ? 'text-amber-300' : 'text-white/40')}>{p.rank}</span>
          <span className={cn('size-3 shrink-0 rounded-full', TEAMS[p.team]?.bg)} title={`${TEAMS[p.team]?.label} team`} />
          <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
          {results?.[p.playerId]?.points > 0 && <span className="text-sm text-emerald-300">+{results[p.playerId].points}</span>}
          <span className="font-bold tabular-nums">{p.score}</span>
        </li>
      ))}
    </ol>
  )
}

export default Leaderboard
