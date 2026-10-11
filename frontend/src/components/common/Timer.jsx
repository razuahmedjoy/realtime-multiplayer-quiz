import { useEffect, useState } from 'react'
import { cn } from '@/utils/helpers'

/**
 * Countdown to the server's `endsAt`. `clockOffset` (server time - local time)
 * keeps every device's countdown in sync even if their clocks differ.
 */
const Timer = ({ endsAt, timeLimit, clockOffset = 0, size = 'ring' }) => {
  const remainingMs = () => Math.max(0, endsAt - (Date.now() + clockOffset))
  const [remaining, setRemaining] = useState(remainingMs)

  useEffect(() => {
    const id = setInterval(() => setRemaining(remainingMs()), 200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt, clockOffset])

  const seconds = Math.ceil(remaining / 1000)
  const percent = (remaining / (timeLimit * 1000)) * 100
  const urgent = seconds <= 5

  if (size === 'bar') {
    return (
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-subtle">
          <div className={cn('h-full transition-[width] duration-200 ease-linear', urgent ? 'bg-danger' : 'bg-brand')} style={{ width: `${percent}%` }} />
        </div>
        <span className={cn('w-6 text-right font-mono text-sm tabular-nums', urgent ? 'text-danger' : 'text-muted')}>{seconds}</span>
      </div>
    )
  }

  const r = 44
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid size-20 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="6" className="stroke-subtle" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className={cn('transition-[stroke-dashoffset] duration-200 ease-linear', urgent ? 'stroke-danger' : 'stroke-brand')}
        />
      </svg>
      <span className={cn('font-mono text-2xl tabular-nums', urgent && 'text-danger')}>{seconds}</span>
    </div>
  )
}

export default Timer
