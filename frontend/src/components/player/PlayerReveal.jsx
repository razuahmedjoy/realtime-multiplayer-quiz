import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import TeamScores from '@/components/common/TeamScores'
import { cn, ordinal } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

const PlayerReveal = ({ me }) => {
  const reveal = useGameStore((s) => s.reveal)
  const result = reveal.results[me.playerId] || { answer: null, correct: false, points: 0 }
  const rank = reveal.leaderboard.find((p) => p.playerId === me.playerId)?.rank

  return (
    <div className={cn('flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center', result.correct ? 'bg-emerald-500/10' : 'bg-rose-500/10')}>
      <div className="animate-pop">
        {result.correct ? (
          <CheckCircle2 className="mx-auto size-20 text-emerald-400" />
        ) : result.answer ? (
          <XCircle className="mx-auto size-20 text-rose-400" />
        ) : (
          <Clock className="mx-auto size-20 text-white/40" />
        )}
        <h2 className="mt-3 text-3xl font-bold">{result.correct ? 'Correct!' : result.answer ? 'Wrong answer' : "Time's up!"}</h2>
        {result.correct && <p className="text-2xl font-bold text-emerald-300">+{result.points} points</p>}
      </div>
      {!result.correct && (
        <p className="text-white/70">
          Correct answer: <span className="font-semibold text-white">{reveal.correctAnswer}</span>
        </p>
      )}
      <div className="card w-full max-w-sm space-y-4 p-4 text-left">
        {rank && (
          <p className="text-center">
            You&apos;re in <span className="font-bold">{ordinal(rank)}</span> place
          </p>
        )}
        <TeamScores teams={reveal.teamScores} highlightTeam={me.team} />
      </div>
    </div>
  )
}

export default PlayerReveal
