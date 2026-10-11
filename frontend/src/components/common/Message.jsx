import { Link } from 'react-router'

// Full-page message for errors and empty states (room not found, kicked, etc.)
const Message = ({ emoji = '🤔', title, text, children }) => (
  <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-20 text-center">
    <span className="text-6xl">{emoji}</span>
    <h1 className="text-2xl font-bold">{title}</h1>
    {text && <p className="text-white/60">{text}</p>}
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {children}
      <Link to="/" className="btn-secondary">
        Go home
      </Link>
    </div>
  </div>
)

export default Message
