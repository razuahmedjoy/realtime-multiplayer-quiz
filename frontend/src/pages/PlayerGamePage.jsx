import { useParams } from 'react-router'
import { Flag, UserX } from 'lucide-react'
import LoadingSpinner from '@/components/common/Loading'
import Message from '@/components/common/Message'
import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'
import { useLobby } from '@/hooks/useLobby'
import { useGameStore } from '@/store/gameStore'
import { usePlayerGame } from '@/hooks/usePlayerGame'
import ConnectionBanner from '@/components/common/ConnectionBanner'
import JoinForm from '@/components/player/JoinForm'
import PlayerWaiting from '@/components/player/PlayerWaiting'
import PlayerQuestion from '@/components/player/PlayerQuestion'
import PlayerReveal from '@/components/player/PlayerReveal'
import PlayerResults from '@/components/player/PlayerResults'

const PlayerGamePage = () => {
  const { lobbyId } = useParams()
  const { data: lobby, error: lobbyError } = useLobby(lobbyId)
  const { playerId, joining, join, answer } = usePlayerGame(lobbyId)
  const state = useGameStore((s) => s.lobbyState)
  const connected = useGameStore((s) => s.connected)
  const kicked = useGameStore((s) => s.kicked)
  const hasQuestion = useGameStore((s) => !!s.question)
  const hasReveal = useGameStore((s) => !!s.reveal)
  const hasResults = useGameStore((s) => !!s.results)

  if (kicked) return <Message icon={UserX} title="You were removed from the room" text="The host removed you from this game." />
  if (lobbyError) return <Message title="Room not found" text="This room doesn't exist or has expired. Ask the host for a new link." />
  if (!lobby) return <LoadingSpinner label="Finding room..." />

  const me = playerId && state?.players.find((p) => p.playerId === playerId)

  if (!me) {
    if (playerId) return <LoadingSpinner label="Reconnecting..." />
    if (lobby.status === 'finished' || state?.status === 'finished') return <Message icon={Flag} title="This game has finished" text="Ask the host to start a new one." />
    return (
      <div className="flex flex-1 flex-col p-4">
        <JoinForm lobby={lobby} onJoin={join} joining={joining || !connected} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <ConnectionBanner />
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2 text-sm">
        <span className="flex items-center gap-2 font-medium">
          <span className={cn('size-2 rounded-full', TEAMS[me.team].dot)} /> {me.name}
        </span>
        <span className="font-mono tabular-nums">{me.score} pts</span>
      </div>

      {state.status === 'waiting' && <PlayerWaiting me={me} />}
      {state.status === 'question' && hasQuestion && <PlayerQuestion onAnswer={answer} />}
      {state.status === 'reveal' && hasReveal && <PlayerReveal me={me} />}
      {state.status === 'finished' && hasResults && <PlayerResults me={me} />}
    </div>
  )
}

export default PlayerGamePage
