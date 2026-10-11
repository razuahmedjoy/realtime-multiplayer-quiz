import { ArrowDown, ArrowUp, Check, Trash2, X } from 'lucide-react'
import { ANSWER_LETTERS, TIME_LIMITS } from '@/constants'
import { cn } from '@/utils/helpers'
import { MAX_OPTIONS, MIN_OPTIONS } from '@/utils/quizForm'

const iconBtn = 'rounded-md p-1.5 text-muted transition-colors hover:bg-subtle hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent'

/** Editor card for one question: text, 2-4 options, correct answer, optional timer. */
const QuestionCard = ({ question: q, index, total, onChange, onMove, onRemove }) => {
  const update = (patch) => onChange({ ...q, ...patch })
  const setOption = (i, value) => update({ options: q.options.map((o, j) => (j === i ? value : o)) })
  const removeOption = (i) => {
    const answerIndex = q.answerIndex === i ? 0 : q.answerIndex > i ? q.answerIndex - 1 : q.answerIndex
    update({ options: q.options.filter((_, j) => j !== i), answerIndex })
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-1">
        <span className="mr-auto text-sm font-medium text-muted">Question {index + 1}</span>
        <select
          value={q.timeLimit}
          onChange={(e) => update({ timeLimit: e.target.value ? Number(e.target.value) : '' })}
          className="mr-2 h-8 rounded-md border border-line bg-surface px-2 text-sm"
          aria-label="Time limit"
        >
          <option value="">Room default time</option>
          {TIME_LIMITS.map((t) => (
            <option key={t} value={t}>
              {t} seconds
            </option>
          ))}
        </select>
        <button type="button" className={iconBtn} onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
          <ArrowUp className="size-4" />
        </button>
        <button type="button" className={iconBtn} onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move down">
          <ArrowDown className="size-4" />
        </button>
        <button type="button" className={cn(iconBtn, 'hover:bg-danger-soft hover:text-danger')} onClick={onRemove} disabled={total === 1} aria-label="Delete question">
          <Trash2 className="size-4" />
        </button>
      </div>

      <textarea
        value={q.question}
        onChange={(e) => update({ question: e.target.value })}
        rows={2}
        placeholder="Type your question..."
        className="input mb-3 h-auto resize-none py-2.5"
      />

      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map((option, i) => {
          const isAnswer = q.answerIndex === i
          return (
            <div key={i} className={cn('flex items-center gap-2 rounded-md border p-1', isAnswer ? 'border-brand bg-brand-soft' : 'border-line')}>
              <span className={cn('grid size-7 shrink-0 place-items-center rounded text-xs font-semibold', isAnswer ? 'bg-brand text-white' : 'bg-subtle text-muted')}>
                {ANSWER_LETTERS[i]}
              </span>
              <input
                value={option}
                onChange={(e) => setOption(i, e.target.value)}
                placeholder={`Option ${ANSWER_LETTERS[i]}`}
                className="h-8 min-w-0 flex-1 bg-transparent px-1 text-sm placeholder:text-muted/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => update({ answerIndex: i })}
                title={isAnswer ? 'Correct answer' : 'Mark as correct'}
                aria-pressed={isAnswer}
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full border',
                  isAnswer ? 'border-brand bg-brand text-white' : 'border-line text-transparent hover:border-brand hover:text-brand',
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </button>
              {q.options.length > MIN_OPTIONS && (
                <button type="button" onClick={() => removeOption(i)} className="p-1 text-muted hover:text-danger" aria-label="Remove option">
                  <X className="size-4" />
                </button>
              )}
            </div>
          )
        })}
      </div>
      {q.options.length < MAX_OPTIONS && (
        <button type="button" onClick={() => update({ options: [...q.options, ''] })} className="mt-2 text-sm font-medium text-brand hover:text-brand-strong">
          + Add option
        </button>
      )}
    </div>
  )
}

export default QuestionCard
