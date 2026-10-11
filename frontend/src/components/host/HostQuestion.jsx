import { Eye } from 'lucide-react'
import Timer from '@/components/common/Timer'
import AnswerButton from '@/components/common/AnswerButton'
import { useGameStore } from '@/store/gameStore'

/** Big-screen question with countdown and answer progress. */
const HostQuestion = ({ busy, onReveal }) => {
  const question = useGameStore((s) => s.question)
  const progress = useGameStore((s) => s.progress)
  const clockOffset = useGameStore((s) => s.clockOffset)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <Timer key={question.endsAt} endsAt={question.endsAt} timeLimit={question.timeLimit} clockOffset={clockOffset} />
        <div className="text-center">
          <p className="text-4xl font-bold tabular-nums">
            {progress.answeredCount}
            <span className="text-white/30">/{progress.playerCount}</span>
          </p>
          <p className="text-sm text-white/50">answered</p>
        </div>
        <button className="btn-secondary" onClick={onReveal} disabled={busy}>
          <Eye className="size-4" /> Reveal now
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <h1 className="max-w-4xl animate-pop text-center text-3xl font-bold sm:text-5xl">{question.question}</h1>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, i) => (
          <AnswerButton key={option} index={i} text={option} disabled />
        ))}
      </div>
    </div>
  )
}

export default HostQuestion
