import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import TeamScores from '@/components/common/TeamScores'
import { ordinal } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

const PlayerReveal = ({ me }) => {
  const reveal = useGameStore((s) => s.reveal)
  const result = reveal.results[me.playerId] || { answer: null, correct: false, points: 0 }
  const rank = reveal.leaderboard.find((p) => p.playerId === me.playerId)?.rank

  const status = result.correct
    ? { Icon: CheckCircle2, color: 'text-brand', title: 'Correct' }
    : result.answer
      ? { Icon: XCircle, color: 'text-danger', title: 'Wrong answer' }
      : { Icon: Clock, color: 'text-muted', title: "Time's up" }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
      <div>
        <status.Icon className={`mx-auto size-12 ${status.color}`} strokeWidth={1.75} />
        <h2 className="mt-3 text-2xl font-semibold">{status.title}</h2>
        {result.correct && <p className="mt-1 font-mono text-lg text-brand">+{result.points} points</p>}
        {!result.correct && (
          <p className="mt-2 text-sm text-muted">
            Correct answer: <span className="font-medium text-ink">{reveal.correctAnswer}</span>
          </p>
        )}
      </div>
      <div className="card w-full max-w-sm space-y-4 p-4 text-left">
        {rank && (
          <p className="text-sm">
            You&apos;re in <span className="font-semibold">{ordinal(rank)}</span> place
          </p>
        )}
        <TeamScores teams={reveal.teamScores} highlightTeam={me.team} />
      </div>
    </div>
  )
}

export default PlayerReveal
