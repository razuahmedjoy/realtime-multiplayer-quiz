import Leaderboard from '@/components/common/Leaderboard'
import TeamScores from '@/components/common/TeamScores'
import { TEAMS } from '@/constants'
import { cn, ordinal } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

const PlayerResults = ({ me }) => {
  const results = useGameStore((s) => s.results)
  const myRank = results.leaderboard.find((p) => p.playerId === me.playerId)?.rank
  const winner = results.teamScores[0]
  const won = winner?.team === me.team

  return (
    <div className="flex flex-1 flex-col items-center gap-5 p-6 text-center">
      <div className="animate-pop">
        <p className="text-6xl">{won ? '🏆' : '🎉'}</p>
        <h1 className="mt-2 text-3xl font-bold">{won ? 'Your team won!' : 'Thanks for playing!'}</h1>
        {winner && !won && <p className={cn('mt-1 font-semibold', TEAMS[winner.team].text)}>{TEAMS[winner.team].label} team wins</p>}
        {myRank && (
          <p className="mt-2 text-white/60">
            You finished <span className="font-bold text-white">{ordinal(myRank)}</span> with <span className="font-bold text-white">{me.score}</span> points
          </p>
        )}
      </div>
      <div className="card w-full max-w-sm space-y-5 p-4 text-left">
        <TeamScores teams={results.teamScores} highlightTeam={me.team} />
        <Leaderboard players={results.leaderboard} highlightId={me.playerId} />
      </div>
    </div>
  )
}

export default PlayerResults
