import { CheckCircle2 } from 'lucide-react'
import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

const PlayerWaiting = ({ me }) => {
  const players = useGameStore((s) => s.lobbyState.players)
  const teammates = players.filter((p) => p.team === me.team)
  const style = TEAMS[me.team]

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div>
        <p className="flex items-center justify-center gap-2 text-sm font-medium text-brand">
          <CheckCircle2 className="size-4" /> You&apos;re in
        </p>
        <h1 className="mt-2 text-xl font-semibold">Waiting for the host to start</h1>
        <p className="mt-1 text-sm text-muted">{players.length} players in the room</p>
      </div>
      <div className="card w-full max-w-sm p-4 text-left">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium">
          <span className={cn('size-2 rounded-full', style.dot)} /> {style.label} team
        </p>
        <div className="flex flex-wrap gap-1.5">
          {teammates.map((p) => (
            <span key={p.playerId} className={cn('rounded px-2 py-1 text-sm', p.playerId === me.playerId ? 'bg-brand-soft text-brand-strong' : 'bg-subtle')}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlayerWaiting
