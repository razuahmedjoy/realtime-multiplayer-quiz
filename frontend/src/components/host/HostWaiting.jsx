import { toast } from 'sonner'
import { Copy, Users, WifiOff, X } from 'lucide-react'
import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'
import { useGameStore } from '@/store/gameStore'

/** Lobby screen: QR code, join link and players grouped by team. */
const HostWaiting = ({ lobby, busy, onStart, onKick }) => {
  const state = useGameStore((s) => s.lobbyState)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(lobby.roomUrl)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy the link')
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 p-4 sm:p-6 lg:grid-cols-[320px_1fr]">
      <div className="card flex flex-col items-center gap-4 p-5 text-center">
        <p className="text-sm font-medium text-muted">Scan to join</p>
        <img src={lobby.qrCode} alt="Room QR code" className="w-56 rounded-md border border-line" />
        <p className="font-mono text-xs break-all text-muted">{lobby.roomUrl}</p>
        <button className="btn-secondary w-full" onClick={copyLink}>
          <Copy className="size-4" /> Copy join link
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{state.roomName}</h1>
            <p className="text-muted">
              {state.quizName} · {state.totalQuestions} questions
            </p>
          </div>
          <button className="btn-primary h-11 px-6" onClick={onStart} disabled={busy || state.players.length === 0}>
            Start quiz
          </button>
        </div>

        <div className="card flex-1 p-4">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-muted">
            <Users className="size-4" /> {state.players.length} player{state.players.length !== 1 && 's'} joined
          </p>
          {state.players.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">Waiting for players to join...</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(TEAMS).map(([team, style]) => {
                const members = state.players.filter((p) => p.team === team)
                return (
                  <div key={team} className="rounded-md border border-line">
                    <p className="flex items-center gap-2 border-b border-line px-3 py-2 text-sm font-medium">
                      <span className={cn('size-2 rounded-full', style.dot)} />
                      {style.label}
                      <span className="ml-auto font-mono text-muted">{members.length}</span>
                    </p>
                    <ul className="p-1">
                      {members.map((p) => (
                        <li key={p.playerId} className="group flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-subtle">
                          <span className={cn('flex-1 truncate', !p.connected && 'text-muted')}>{p.name}</span>
                          {!p.connected && <WifiOff className="size-3.5 text-muted" />}
                          <button onClick={() => onKick(p)} className="text-muted hover:text-danger sm:opacity-0 sm:group-hover:opacity-100" title="Remove player">
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HostWaiting
