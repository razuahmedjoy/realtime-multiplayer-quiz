import { Link } from 'react-router'
import { CircleHelp } from 'lucide-react'

// Full-page message for errors and empty states (room not found, removed, etc.)
const Message = ({ icon: Icon = CircleHelp, title, text, children }) => (
  <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 py-20 text-center">
    <Icon className="mb-2 size-8 text-muted" strokeWidth={1.5} />
    <h1 className="text-xl font-semibold">{title}</h1>
    {text && <p className="text-muted">{text}</p>}
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {children}
      <Link to="/" className="btn-secondary">
        Go home
      </Link>
    </div>
  </div>
)

export default Message
