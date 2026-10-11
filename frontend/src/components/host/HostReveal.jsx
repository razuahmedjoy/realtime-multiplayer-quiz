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
    <div className="mx-auto grid w-full max-w-6xl gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h1 className="text-2xl leading-tight font-semibold sm:text-3xl">{reveal.question}</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {reveal.options.map((option, i) => (
            <AnswerButton
              key={option}
              index={i}
              text={option}
              size="lg"
              count={reveal.counts[option]}
              state={option === reveal.correctAnswer ? 'correct' : 'wrong'}
              disabled
            />
          ))}
        </div>
      </div>
      <div className="card flex flex-col gap-5 p-4">
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted">Team scores</h2>
          <TeamScores teams={reveal.teamScores} />
        </section>
        <section>
          <h2 className="mb-1 text-sm font-medium text-muted">Top players</h2>
          <Leaderboard players={reveal.leaderboard} results={reveal.results} />
        </section>
        <button className="btn-primary mt-auto h-11 w-full" onClick={() => onNext(reveal.index)} disabled={busy}>
          {isLast ? 'Show final results' : 'Next question'} <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

export default HostReveal
