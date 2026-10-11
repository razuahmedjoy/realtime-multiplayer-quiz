import { Check } from 'lucide-react'
import { ANSWER_LETTERS } from '@/constants'
import { cn } from '@/utils/helpers'

const STATE_STYLES = {
  idle: { box: 'border-line bg-surface text-ink', letter: 'bg-subtle text-muted' },
  selected: { box: 'border-brand bg-brand-soft text-ink', letter: 'bg-brand text-white' },
  correct: { box: 'border-brand bg-brand text-white', letter: 'bg-brand-strong text-white' },
  wrong: { box: 'border-line bg-surface text-muted', letter: 'bg-subtle text-muted' },
}

/**
 * One answer option, labelled A-D. `state`: 'idle' | 'selected' | 'correct' | 'wrong'
 */
const AnswerButton = ({ index, text, state = 'idle', count, onClick, disabled, size = 'md' }) => {
  const styles = STATE_STYLES[state]
  const clickable = onClick && !disabled
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border px-3 text-left font-medium transition-colors',
        size === 'lg' ? 'min-h-16 py-3 text-lg' : 'min-h-14 py-2.5 text-base',
        styles.box,
        clickable && 'hover:border-brand hover:bg-brand-soft',
        disabled && 'cursor-default',
      )}
    >
      <span className={cn('grid size-8 shrink-0 place-items-center rounded-md text-sm font-semibold', styles.letter)}>{ANSWER_LETTERS[index]}</span>
      <span className="flex-1 break-words">{text}</span>
      {count !== undefined && <span className="font-mono text-sm tabular-nums">{count}</span>}
      {state === 'correct' && <Check className="size-5 shrink-0" strokeWidth={2.5} />}
    </button>
  )
}

export default AnswerButton
