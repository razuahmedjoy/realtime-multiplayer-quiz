import { ArrowRight } from 'lucide-react'
import AnswerButton from '@/components/common/AnswerButton'
import Leaderboard from '@/components/common/Leaderboard'
import TeamScores from '@/components/common/TeamScores'
import { useGameStore } from '@/store/gameStore'

/** Correct answer, answer breakdown, team scores and top players. */
const HostReveal = ({ busy, onNext }) => {
  const reveal = useGameStore((s) => s.reveal)
  const isLast = reveal.index + 1 >= reveal.total

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <h1 className="text-center text-2xl font-bold sm:text-4xl">{reveal.question}</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {reveal.options.map((option, i) => (
            <AnswerButton key={option} index={i} text={option} count={reveal.counts[option]} state={option === reveal.correctAnswer ? 'correct' : 'wrong'} disabled />
          ))}
        </div>
      </div>
      <div className="card space-y-5 p-5">
        <div>
          <h2 className="mb-3 font-semibold">Team scores</h2>
          <TeamScores teams={reveal.teamScores} />
        </div>
        <div>
          <h2 className="mb-3 font-semibold">Top players</h2>
          <Leaderboard players={reveal.leaderboard} results={reveal.results} />
        </div>
        <button className="btn-primary w-full py-3" onClick={() => onNext(reveal.index)} disabled={busy}>
          {isLast ? 'Show final results' : 'Next question'} <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  )
}

export default HostReveal
