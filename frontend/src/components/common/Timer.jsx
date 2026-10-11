import { useEffect, useState } from 'react'
import { cn } from '@/utils/helpers'

/**
 * Countdown to the server's `endsAt`. `clockOffset` (server time - local time)
 * keeps every device's countdown in sync even if their clocks differ.
 */
const Timer = ({ endsAt, timeLimit, clockOffset = 0, size = 'lg' }) => {
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
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className={cn('h-full rounded-full transition-[width] duration-200 ease-linear', urgent ? 'bg-rose-400' : 'bg-indigo-400')} style={{ width: `${percent}%` }} />
      </div>
    )
  }

  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid size-24 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-white/10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className={cn('transition-[stroke-dashoffset] duration-200 ease-linear', urgent ? 'stroke-rose-400' : 'stroke-indigo-400')}
        />
      </svg>
      <span className={cn('text-3xl font-bold tabular-nums', urgent && 'text-rose-300')}>{seconds}</span>
    </div>
  )
}

export default Timer
