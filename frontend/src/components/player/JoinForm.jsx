import { useState } from 'react'
import { toast } from 'sonner'
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
    <form onSubmit={submit} className="card mx-auto my-auto w-full max-w-sm space-y-5 p-5">
      <div>
        <p className="text-sm text-muted">Joining</p>
        <h1 className="text-xl font-semibold">{lobby.roomName}</h1>
        <p className="text-sm text-muted">{lobby.quizName}</p>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="input h-11" placeholder="Enter your name" autoFocus />
      </label>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Team</legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(TEAMS).map(([key, style]) => (
            <button
              type="button"
              key={key}
              onClick={() => setTeam(key)}
              aria-pressed={team === key}
              className={cn(
                'flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors',
                team === key ? 'border-brand bg-brand-soft' : 'border-line hover:bg-subtle',
              )}
            >
              <span className={cn('size-2.5 rounded-full', style.dot)} />
              {style.label}
            </button>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn-primary h-11 w-full" disabled={joining}>
        {joining ? 'Joining...' : 'Join room'}
      </button>
    </form>
  )
}

export default JoinForm
