import { Link } from 'react-router'
import { RotateCcw } from 'lucide-react'
import Leaderboard from '@/components/common/Leaderboard'
import TeamScores from '@/components/common/TeamScores'
import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

/** Final screen: winning team, team and player rankings. */
const HostResults = ({ busy, onRestart }) => {
  const results = useGameStore((s) => s.results)
  const winner = results.teamScores[0]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 text-center sm:p-6">
      <p className="text-sm font-semibold tracking-widest text-indigo-300 uppercase">Final results</p>
      {winner ? (
        <div className="animate-pop">
          <p className="text-6xl">🏆</p>
          <h1 className={cn('mt-2 text-4xl font-extrabold sm:text-5xl', TEAMS[winner.team].text)}>{TEAMS[winner.team].label} team wins!</h1>
          <p className="mt-1 text-white/60">{winner.score} points</p>
        </div>
      ) : (
        <h1 className="text-3xl font-bold">Quiz finished</h1>
      )}
      <div className="grid gap-4 text-left md:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">Team rankings</h2>
          <TeamScores teams={results.teamScores} />
        </div>
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">Player rankings</h2>
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
