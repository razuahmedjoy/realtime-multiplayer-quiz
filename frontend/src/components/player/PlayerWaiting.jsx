import { CheckCircle2 } from 'lucide-react'
import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

const PlayerWaiting = ({ me }) => {
  const players = useGameStore((s) => s.lobbyState.players)
  const teammates = players.filter((p) => p.team === me.team)
  const style = TEAMS[me.team]

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
      <span className={cn('grid size-24 animate-float place-items-center rounded-full text-4xl font-bold', style.bg)}>{me.name[0].toUpperCase()}</span>
      <div>
        <p className="flex items-center justify-center gap-2 font-semibold text-emerald-300">
          <CheckCircle2 className="size-5" /> You&apos;re in!
        </p>
        <h1 className="mt-2 text-2xl font-bold">Waiting for the host to start...</h1>
        <p className="mt-1 text-white/50">{players.length} players in the room</p>
      </div>
      <div className="card w-full max-w-sm p-4">
        <p className={cn('mb-2 text-sm font-semibold', style.text)}>Your team: {style.label}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {teammates.map((p) => (
            <span key={p.playerId} className={cn('rounded-full px-3 py-1 text-sm', p.playerId === me.playerId ? style.bg : 'bg-white/10')}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlayerWaiting
