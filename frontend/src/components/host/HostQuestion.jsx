import Timer from '@/components/common/Timer'
import AnswerButton from '@/components/common/AnswerButton'
import { useGameStore } from '@/store/gameStore'

/** Big-screen question with countdown and answer progress. */
const HostQuestion = ({ busy, onReveal }) => {
  const question = useGameStore((s) => s.question)
  const progress = useGameStore((s) => s.progress)
  const clockOffset = useGameStore((s) => s.clockOffset)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <Timer key={question.endsAt} endsAt={question.endsAt} timeLimit={question.timeLimit} clockOffset={clockOffset} />
        <div className="text-center">
          <p className="font-mono text-3xl tabular-nums">
            {progress.answeredCount}
            <span className="text-muted">/{progress.playerCount}</span>
          </p>
          <p className="text-sm text-muted">answered</p>
        </div>
        <button className="btn-secondary" onClick={onReveal} disabled={busy}>
          Reveal answer
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center py-6">
        <h1 className="max-w-4xl text-center text-3xl leading-tight font-semibold sm:text-4xl">{question.question}</h1>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, i) => (
          <AnswerButton key={option} index={i} text={option} size="lg" disabled />
        ))}
      </div>
    </div>
  )
}

export default HostQuestion
