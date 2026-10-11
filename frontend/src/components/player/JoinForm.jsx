import { useState } from 'react'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'
import { TEAMS } from '@/constants'
import { cn } from '@/utils/helpers'

const JoinForm = ({ lobby, joining, onJoin }) => {
  const [name, setName] = useState('')
  const [team, setTeam] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Please enter your name')
    if (!team) return toast.error('Please pick a team')
    onJoin(name.trim(), team)
  }

  return (
    <form onSubmit={submit} className="card mx-auto my-auto w-full max-w-md space-y-6 p-6">
      <div className="text-center">
        <p className="text-sm text-white/50">You&apos;re joining</p>
        <h1 className="text-2xl font-bold">{lobby.roomName}</h1>
        <p className="text-sm text-white/50">{lobby.quizName}</p>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-white/80">Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="input h-12 text-lg" placeholder="Enter your name" autoFocus />
      </label>
      <div>
        <span className="mb-1.5 block text-sm font-medium text-white/80">Pick a team</span>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(TEAMS).map(([key, style]) => (
            <button
              type="button"
              key={key}
              onClick={() => setTeam(key)}
              className={cn('rounded-xl py-3 font-semibold transition', team === key ? `${style.bg} text-white ring-2 ring-white` : `${style.soft} ${style.text} hover:brightness-125`)}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="btn-primary w-full py-3 text-lg" disabled={joining}>
        <LogIn className="size-5" /> {joining ? 'Joining...' : 'Join Room'}
      </button>
    </form>
  )
}

export default JoinForm
