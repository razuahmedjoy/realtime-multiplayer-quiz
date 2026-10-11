import { toast } from 'sonner'
import { Copy, Play, Users, WifiOff, X } from 'lucide-react'
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
    <div className="mx-auto grid w-full max-w-6xl gap-6 p-4 sm:p-6 lg:grid-cols-[360px_1fr]">
      <div className="card flex flex-col items-center gap-4 p-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-300">Scan to join</h2>
        <img src={lobby.qrCode} alt="Room QR code" className="w-60 rounded-xl bg-white p-2" />
        <a href={lobby.roomUrl} target="_blank" rel="noreferrer" className="text-sm break-all text-white/60 hover:text-white">
          {lobby.roomUrl}
        </a>
        <button className="btn-secondary text-sm" onClick={copyLink}>
          <Copy className="size-4" /> Copy join link
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{state.roomName}</h1>
            <p className="text-white/50">
              {state.quizName} · {state.totalQuestions} questions
            </p>
          </div>
          <button className="btn-primary px-8 py-3 text-lg" onClick={onStart} disabled={busy || state.players.length === 0}>
            <Play className="size-5 fill-white" /> Start Quiz
          </button>
        </div>

        <div className="card flex-1 p-5">
          <p className="mb-4 flex items-center gap-2 font-semibold text-white/70">
            <Users className="size-5" /> {state.players.length} player{state.players.length !== 1 && 's'} joined
          </p>
          {state.players.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-white/40">
              <span className="animate-float text-5xl">📱</span>
              Waiting for players to join...
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(TEAMS).map(([team, style]) => {
                const members = state.players.filter((p) => p.team === team)
                return (
                  <div key={team} className={cn('rounded-xl border-t-4 bg-white/5 p-3', style.border)}>
                    <p className={cn('mb-2 text-sm font-semibold', style.text)}>
                      {style.label} · {members.length}
                    </p>
                    <ul className="space-y-1.5">
                      {members.map((p) => (
                        <li key={p.playerId} className="group flex animate-pop items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-sm">
                          <span className={cn('grid size-7 place-items-center rounded-full text-xs font-bold', style.bg)}>{p.name[0].toUpperCase()}</span>
                          <span className={cn('flex-1 truncate', !p.connected && 'text-white/40')}>{p.name}</span>
                          {!p.connected && <WifiOff className="size-3.5 text-white/40" />}
                          <button onClick={() => onKick(p)} className="text-white/30 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100" title="Remove player">
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
