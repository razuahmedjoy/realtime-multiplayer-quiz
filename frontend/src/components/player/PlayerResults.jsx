import { Flag, Trophy } from 'lucide-react'
import Leaderboard from '@/components/common/Leaderboard'
import TeamScores from '@/components/common/TeamScores'
import { TEAMS } from '@/constants'
import { ordinal } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

const PlayerResults = ({ me }) => {
  const results = useGameStore((s) => s.results)
  const myRank = results.leaderboard.find((p) => p.playerId === me.playerId)?.rank
  const winner = results.teamScores[0]
  const won = winner?.team === me.team
  const Icon = won ? Trophy : Flag

  return (
    <div className="flex flex-1 flex-col items-center gap-5 p-6 text-center">
      <div>
        <Icon className={`mx-auto size-10 ${won ? 'text-brand' : 'text-muted'}`} strokeWidth={1.75} />
        <h1 className="mt-3 text-2xl font-semibold">{won ? 'Your team won' : 'Thanks for playing'}</h1>
        {winner && !won && <p className="mt-1 text-sm text-muted">{TEAMS[winner.team].label} team wins</p>}
        {myRank && (
          <p className="mt-2 text-sm text-muted">
            You finished <span className="font-medium text-ink">{ordinal(myRank)}</span> with{' '}
            <span className="font-mono text-ink">{me.score}</span> points
          </p>
        )}
      </div>
      <div className="card w-full max-w-sm space-y-4 p-4 text-left">
        <TeamScores teams={results.teamScores} highlightTeam={me.team} />
        <Leaderboard players={results.leaderboard} highlightId={me.playerId} />
      </div>
    </div>
  )
}

export default PlayerResults
