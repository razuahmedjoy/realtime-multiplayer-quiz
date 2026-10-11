import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Plus, Rocket } from 'lucide-react'
import LoadingSpinner from '@/components/common/Loading'
import Message from '@/components/common/Message'
import { TIME_LIMITS } from '@/constants'
import { useQuizzes } from '@/hooks/useQuizzes'
import { useSessionStore } from '@/store/sessionStore'
import { useCreateLobby } from '@/hooks/useLobby'
import QuizPicker from '@/components/quiz/QuizPicker'

const HomePage = () => {
  const navigate = useNavigate()
  const { data: quizzes, isPending, error } = useQuizzes()
  const createLobby = useCreateLobby()
  const setHostKey = useSessionStore((s) => s.setHostKey)

  // Form inputs are local UI state
  const [quizId, setQuizId] = useState('')
  const [roomName, setRoomName] = useState('')
  const [timeLimit, setTimeLimit] = useState(20)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!quizId) return toast.error('Please select a quiz')
    if (!roomName.trim()) return toast.error('Please enter a room name')

    createLobby.mutate(
      { quizId, roomName: roomName.trim(), timeLimit },
      {
        onSuccess: (lobby) => {
          setHostKey(lobby.id, lobby.hostKey)
          navigate(`/lobby-leader/${lobby.id}`)
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  if (isPending) return <LoadingSpinner label="Loading quizzes..." />
  if (error) return <Message title="Couldn't load quizzes" text={`${error.message}. Is the server running?`} />

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Host a <span className="text-indigo-400">live trivia</span> game
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Pick a quiz, open a room, and let players join from their phones by scanning a QR code. Teams compete in real time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">1. Choose a quiz</h2>
            <Link to="/quizzes/new" className="btn-ghost text-sm">
              <Plus className="size-4" /> Create your own
            </Link>
          </div>
          {quizzes.length === 0 ? (
            <div className="card p-8 text-center text-white/60">
              No quizzes yet.{' '}
              <Link to="/quizzes/new" className="text-indigo-300 underline">
                Create one
              </Link>
              .
            </div>
          ) : (
            <QuizPicker quizzes={quizzes} selectedId={quizId} onSelect={setQuizId} />
          )}
        </section>

        <section className="card grid gap-4 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/80">2. Room name</span>
            <input value={roomName} onChange={(e) => setRoomName(e.target.value)} maxLength={60} className="input" placeholder="e.g. Friday Team Trivia" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/80">Time per question</span>
            <select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="input bg-night-900">
              {TIME_LIMITS.map((t) => (
                <option key={t} value={t}>
                  {t} seconds
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn-primary h-11" disabled={createLobby.isPending}>
            <Rocket className="size-4" /> {createLobby.isPending ? 'Creating...' : 'Create Lobby'}
          </button>
        </section>
      </form>
    </div>
  )
}

export default HomePage
