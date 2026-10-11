import { Link } from 'react-router'
import { RotateCcw, Trophy } from 'lucide-react'
import Leaderboard from '@/components/common/Leaderboard'
import TeamScores from '@/components/common/TeamScores'
import { TEAMS } from '@/constants'
import { useGameStore } from '@/store/gameStore'

/** Final screen: winning team, team and player rankings. */
const HostResults = ({ busy, onRestart }) => {
  const results = useGameStore((s) => s.results)
  const winner = results.teamScores[0]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="text-center">
        <p className="text-sm font-medium text-muted">Final results</p>
        {winner ? (
          <>
            <h1 className="mt-2 flex items-center justify-center gap-2 text-3xl font-semibold">
              <Trophy className="size-7 text-brand" /> {TEAMS[winner.team].label} team wins
            </h1>
            <p className="mt-1 font-mono text-muted">{winner.score} points</p>
          </>
        ) : (
          <h1 className="mt-2 text-3xl font-semibold">Quiz finished</h1>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 text-sm font-medium text-muted">Team rankings</h2>
          <TeamScores teams={results.teamScores} />
        </div>
        <div className="card p-4">
          <h2 className="mb-1 text-sm font-medium text-muted">Player rankings</h2>
          <Leaderboard players={results.leaderboard} limit={10} />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button className="btn-primary" onClick={onRestart} disabled={busy}>
          <RotateCcw className="size-4" /> Play again
        </button>
        <Link to="/" className="btn-secondary">
          New game
        </Link>
      </div>
    </div>
  )
}

export default HostResults
