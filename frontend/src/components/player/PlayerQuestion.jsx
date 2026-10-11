import Timer from '@/components/common/Timer'
import AnswerButton from '@/components/common/AnswerButton'
import { ANSWER_STYLES } from '@/constants'
import { cn } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

const PlayerQuestion = ({ onAnswer }) => {
  const question = useGameStore((s) => s.question)
  const myAnswer = useGameStore((s) => s.myAnswer)
  const clockOffset = useGameStore((s) => s.clockOffset)

  if (myAnswer) {
    const { bg, Icon } = ANSWER_STYLES[question.options.indexOf(myAnswer)] || ANSWER_STYLES[0]
    return (
      <div className="flex flex-1 animate-pop flex-col items-center justify-center gap-4 p-6 text-center">
        <span className={cn('grid size-20 place-items-center rounded-2xl', bg)}>
          <Icon className="size-10 fill-white text-white" />
        </span>
        <h2 className="text-2xl font-bold">Answer locked in!</h2>
        <p className="text-white/50">&ldquo;{myAnswer}&rdquo; · waiting for the others</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Timer key={question.endsAt} size="bar" endsAt={question.endsAt} timeLimit={question.timeLimit} clockOffset={clockOffset} />
      <p className="text-center text-sm text-white/50">
        Question {question.index + 1} of {question.total}
      </p>
      <div className="flex flex-1 items-center justify-center">
        <h2 className="text-center text-2xl font-bold">{question.question}</h2>
      </div>
      <div className="grid gap-3">
        {question.options.map((option, i) => (
          <AnswerButton key={option} index={i} text={option} onClick={() => onAnswer(option)} />
        ))}
      </div>
    </div>
  )
}

export default PlayerQuestion
