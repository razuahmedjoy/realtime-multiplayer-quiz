import { Link, useParams } from 'react-router'
import LoadingSpinner from '@/components/common/Loading'
import Message from '@/components/common/Message'
import { useLobby } from '@/hooks/useLobby'
import { useGameStore } from '@/store/gameStore'
import { useHostGame } from '@/hooks/useHostGame'
import ConnectionBanner from '@/components/common/ConnectionBanner'
import HostWaiting from '@/components/host/HostWaiting'
import HostQuestion from '@/components/host/HostQuestion'
import HostReveal from '@/components/host/HostReveal'
import HostResults from '@/components/host/HostResults'

const HostGamePage = () => {
  const { lobbyId } = useParams()
  const { data: lobby, error: lobbyError } = useLobby(lobbyId)
  const { hostKey, joinError, busy, actions } = useHostGame(lobbyId)
  const state = useGameStore((s) => s.lobbyState)
  const hasQuestion = useGameStore((s) => !!s.question)
  const hasReveal = useGameStore((s) => !!s.reveal)
  const hasResults = useGameStore((s) => !!s.results)

  if (!hostKey)
    return (
      <Message title="You're not the host of this room" text="Only the browser that created this room can control it.">
        <Link to={`/player/${lobbyId}`} className="btn-primary">
          Join as a player
        </Link>
      </Message>
    )
  if (lobbyError || joinError) return <Message title="Room unavailable" text={lobbyError?.message || joinError} />
  if (!lobby || !state) return <LoadingSpinner label="Opening room..." />

  const inGame = state.status === 'question' || state.status === 'reveal'
  const kick = (player) => window.confirm(`Remove ${player.name} from the room?`) && actions.kick(player.playerId)

  return (
    <div className="flex flex-1 flex-col">
      <ConnectionBanner />
      {inGame && (
        <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-1.5 text-sm text-muted">
          <span>
            {state.roomName} · Question {state.currentQuestion + 1} of {state.totalQuestions}
          </span>
          <button className="btn-ghost h-8 px-3" onClick={() => window.confirm('End the quiz now?') && actions.end()}>
            End quiz
          </button>
        </div>
      )}

      {state.status === 'waiting' && <HostWaiting lobby={lobby} busy={busy} onStart={actions.start} onKick={kick} />}
      {state.status === 'question' && hasQuestion && <HostQuestion busy={busy} onReveal={actions.reveal} />}
      {state.status === 'reveal' && hasReveal && <HostReveal busy={busy} onNext={actions.next} />}
      {state.status === 'finished' && hasResults && <HostResults busy={busy} onRestart={actions.restart} />}
    </div>
  )
}

export default HostGamePage
