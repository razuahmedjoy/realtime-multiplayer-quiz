import { Trophy } from 'lucide-react'
import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'

/** Team totals as horizontal bars, highest first. */
const TeamScores = ({ teams, highlightTeam }) => {
  if (!teams?.length) return null
  const max = Math.max(...teams.map((t) => t.score), 1)
  return (
    <ul className="space-y-3">
      {teams.map((t, i) => (
        <li key={t.team}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className={cn('flex items-center gap-1.5 font-semibold', TEAMS[t.team].text, t.team === highlightTeam && 'underline underline-offset-4')}>
              {i === 0 && t.score > 0 && <Trophy className="size-4" />}
              {TEAMS[t.team].label} team
              <span className="font-normal text-white/40">
                · {t.players} player{t.players !== 1 && 's'}
              </span>
            </span>
            <span className="font-bold tabular-nums">{t.score}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div className={cn('h-full rounded-full transition-all duration-700', TEAMS[t.team].bg)} style={{ width: `${(t.score / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TeamScores
