import { ArrowDown, ArrowUp, Check, Trash2, X } from 'lucide-react'
import { ANSWER_STYLES, TIME_LIMITS } from '@/constants'
import { cn } from '@/utils/helpers'
import { MAX_OPTIONS, MIN_OPTIONS } from '@/utils/quizForm'

/** Editor card for one question: text, 2-4 options, correct answer, optional timer. */
const QuestionCard = ({ question: q, index, total, onChange, onMove, onRemove }) => {
  const update = (patch) => onChange({ ...q, ...patch })
  const setOption = (i, value) => update({ options: q.options.map((o, j) => (j === i ? value : o)) })
  const removeOption = (i) => {
    const answerIndex = q.answerIndex === i ? 0 : q.answerIndex > i ? q.answerIndex - 1 : q.answerIndex
    update({ options: q.options.filter((_, j) => j !== i), answerIndex })
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-lg bg-indigo-500/20 px-2.5 py-1 text-sm font-bold text-indigo-200">Q{index + 1}</span>
        <select
          value={q.timeLimit}
          onChange={(e) => update({ timeLimit: e.target.value ? Number(e.target.value) : '' })}
          className="ml-auto h-9 rounded-lg border border-white/10 bg-night-900 px-2 text-sm"
          aria-label="Time limit"
        >
          <option value="">Room default time</option>
          {TIME_LIMITS.map((t) => (
            <option key={t} value={t}>
              {t} seconds
            </option>
          ))}
        </select>
        <button type="button" className="btn-ghost p-2" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
          <ArrowUp className="size-4" />
        </button>
        <button type="button" className="btn-ghost p-2" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move down">
          <ArrowDown className="size-4" />
        </button>
        <button type="button" className="btn-ghost p-2 hover:text-rose-300" onClick={onRemove} disabled={total === 1} aria-label="Delete question">
          <Trash2 className="size-4" />
        </button>
      </div>

      <textarea
        value={q.question}
        onChange={(e) => update({ question: e.target.value })}
        rows={2}
        placeholder="Type your question..."
        className="input mb-3 h-auto resize-none py-3 text-lg font-medium"
      />

      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map((option, i) => {
          const isAnswer = q.answerIndex === i
          const { bg, Icon } = ANSWER_STYLES[i]
          return (
            <div key={i} className={cn('flex items-center gap-2 rounded-xl border p-1.5', isAnswer ? 'border-emerald-400/70 bg-emerald-500/10' : 'border-white/10')}>
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', bg)}>
                <Icon className="size-4 fill-white text-white" />
              </span>
              <input
                value={option}
                onChange={(e) => setOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="h-9 min-w-0 flex-1 bg-transparent px-1 placeholder:text-white/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => update({ answerIndex: i })}
                title={isAnswer ? 'Correct answer' : 'Mark as correct'}
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full border-2',
                  isAnswer ? 'border-emerald-400 bg-emerald-400 text-night-950' : 'border-white/20 text-transparent hover:border-emerald-400',
                )}
              >
                <Check className="size-4" strokeWidth={3} />
              </button>
              {q.options.length > MIN_OPTIONS && (
                <button type="button" onClick={() => removeOption(i)} className="p-1 text-white/30 hover:text-rose-300" aria-label="Remove option">
                  <X className="size-4" />
                </button>
              )}
            </div>
          )
        })}
      </div>
      {q.options.length < MAX_OPTIONS && (
        <button type="button" onClick={() => update({ options: [...q.options, ''] })} className="mt-2 text-sm text-indigo-300 hover:text-indigo-200">
          + Add option
        </button>
      )}
    </div>
  )
}

export default QuestionCard
