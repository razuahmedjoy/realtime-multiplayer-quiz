import { Check, X } from 'lucide-react'
import { ANSWER_STYLES } from '@/constants'
import { cn } from '@/utils/helpers'

/**
 * One answer option. `state`: 'idle' | 'selected' | 'correct' | 'wrong'
 */
const AnswerButton = ({ index, text, state = 'idle', count, onClick, disabled }) => {
  const { bg, Icon } = ANSWER_STYLES[index % ANSWER_STYLES.length]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex min-h-20 w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-lg font-semibold text-white shadow-lg transition',
        bg,
        onClick && !disabled && 'hover:brightness-110 active:scale-[0.98]',
        state === 'selected' && 'ring-4 ring-white/80 ring-offset-2 ring-offset-night-950',
        state === 'correct' && 'ring-4 ring-emerald-300 ring-offset-2 ring-offset-night-950',
        state === 'wrong' && 'opacity-40',
        disabled && 'cursor-default',
      )}
    >
      <Icon className="size-6 shrink-0 fill-white/90 text-white/90" />
      <span className="flex-1 break-words">{text}</span>
      {count !== undefined && <span className="rounded-lg bg-black/20 px-2.5 py-0.5 tabular-nums">{count}</span>}
      {state === 'correct' && <Check className="size-7 shrink-0" strokeWidth={3} />}
      {state === 'wrong' && <X className="size-6 shrink-0" />}
    </button>
  )
}

export default AnswerButton
