import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'

/** Player rankings. `results` (optional) shows points earned on the last question. */
const Leaderboard = ({ players, limit = 5, highlightId, results }) => {
  if (!players?.length) return <p className="py-3 text-sm text-muted">No players</p>
  return (
    <ol className="divide-y divide-line">
      {players.slice(0, limit).map((p) => (
        <li key={p.playerId} className={cn('flex items-center gap-3 px-2 py-2.5 text-sm', p.playerId === highlightId && 'bg-brand-soft')}>
          <span className="w-5 text-right font-mono text-muted tabular-nums">{p.rank}</span>
          <span className={cn('size-2 shrink-0 rounded-full', TEAMS[p.team]?.dot)} title={`${TEAMS[p.team]?.label} team`} />
          <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
          {results?.[p.playerId]?.points > 0 && <span className="font-mono text-brand tabular-nums">+{results[p.playerId].points}</span>}
          <span className="w-12 text-right font-mono font-medium tabular-nums">{p.score}</span>
        </li>
      ))}
    </ol>
  )
}

export default Leaderboard
