import { Link, NavLink, Outlet } from 'react-router'
import { cn } from '@/utils/helpers'

const navClass = ({ isActive }) =>
  cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', isActive ? 'bg-subtle text-ink' : 'text-muted hover:text-ink')

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-md bg-brand text-sm font-bold text-white">Q</span>
            Trivia
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" end className={navClass}>
              Host a game
            </NavLink>
            <NavLink to="/quizzes" className={navClass}>
              Quizzes
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
