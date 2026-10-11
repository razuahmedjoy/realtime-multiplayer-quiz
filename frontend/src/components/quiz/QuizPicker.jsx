import { Check } from 'lucide-react'
import { cn } from '@/utils/helpers'

/** Grid of selectable quiz cards. */
const QuizPicker = ({ quizzes, selectedId, onSelect }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {quizzes.map((quiz) => {
      const selected = quiz._id === selectedId
      return (
        <button
          type="button"
          key={quiz._id}
          onClick={() => onSelect(quiz._id)}
          className={cn('card relative p-4 text-left transition hover:border-white/25', selected && 'border-indigo-400 bg-indigo-500/15 hover:border-indigo-400')}
        >
          {selected && (
            <span className="absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-indigo-500">
              <Check className="size-4" />
            </span>
          )}
          <p className="pr-8 font-semibold">{quiz.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-white/50">{quiz.description || 'No description'}</p>
          <p className="mt-3 text-xs text-white/40">
            {quiz.questionCount} questions · {quiz.isBuiltIn ? 'Built-in' : 'Custom'}
          </p>
        </button>
      )
    })}
  </div>
)

export default QuizPicker
