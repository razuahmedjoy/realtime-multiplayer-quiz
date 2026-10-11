import Timer from '@/components/common/Timer'
import AnswerButton from '@/components/common/AnswerButton'
import { ANSWER_LETTERS } from '@/constants'
import { useGameStore } from '@/store/gameStore'

const PlayerQuestion = ({ onAnswer }) => {
  const question = useGameStore((s) => s.question)
  const myAnswer = useGameStore((s) => s.myAnswer)
  const clockOffset = useGameStore((s) => s.clockOffset)

  if (myAnswer) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="grid size-14 place-items-center rounded-lg bg-brand text-2xl font-semibold text-white">
          {ANSWER_LETTERS[question.options.indexOf(myAnswer)]}
        </span>
        <h2 className="text-xl font-semibold">Answer locked in</h2>
        <p className="text-sm text-muted">&ldquo;{myAnswer}&rdquo; · waiting for the others</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 p-4 pb-20">
      <Timer key={question.endsAt} size="bar" endsAt={question.endsAt} timeLimit={question.timeLimit} clockOffset={clockOffset} />
      <p className="text-sm text-muted">
        Question {question.index + 1} of {question.total}
      </p>
      <div className="flex flex-1 items-center">
        <h2 className="text-2xl leading-snug font-semibold">{question.question}</h2>
      </div>
      <div className="grid gap-2">
        {question.options.map((option, i) => (
          <AnswerButton key={option} index={i} text={option} onClick={() => onAnswer(option)} />
        ))}
      </div>
    </div>
  )
}

export default PlayerQuestion
