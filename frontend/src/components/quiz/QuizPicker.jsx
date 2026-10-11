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
          aria-pressed={selected}
          className={cn('card relative p-4 text-left transition-colors hover:border-muted/50', selected && 'border-brand bg-brand-soft hover:border-brand')}
        >
          {selected && <Check className="absolute top-4 right-4 size-4 text-brand" strokeWidth={2.5} />}
          <p className="pr-6 font-medium">{quiz.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{quiz.description || 'No description'}</p>
          <p className="mt-3 text-xs text-muted">
            {quiz.questionCount} questions · {quiz.isBuiltIn ? 'Built-in' : 'Custom'}
          </p>
        </button>
      )
    })}
  </div>
)

export default QuizPicker
