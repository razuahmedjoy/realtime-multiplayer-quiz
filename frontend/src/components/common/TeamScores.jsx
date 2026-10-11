import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'

/** Team totals as horizontal bars, highest first. */
const TeamScores = ({ teams, highlightTeam }) => {
  if (!teams?.length) return null
  const max = Math.max(...teams.map((t) => t.score), 1)
  return (
    <ul className="space-y-3">
      {teams.map((t) => (
        <li key={t.team}>
          <div className="mb-1.5 flex items-center gap-2 text-sm">
            <span className={cn('size-2 rounded-full', TEAMS[t.team].dot)} />
            <span className={cn('font-medium', t.team === highlightTeam && 'underline underline-offset-4')}>{TEAMS[t.team].label}</span>
            <span className="text-muted">
              {t.players} player{t.players !== 1 && 's'}
            </span>
            <span className="ml-auto font-mono font-medium tabular-nums">{t.score}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
            <div className="h-full bg-brand transition-all duration-500" style={{ width: `${(t.score / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TeamScores
