import { Link, NavLink, Outlet } from 'react-router'
import { BookOpen, Gamepad2 } from 'lucide-react'
import { cn } from '@/utils/helpers'

const navClass = ({ isActive }) =>
  cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition', isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white')

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-white/5 bg-night-950/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-500 text-lg">?</span>
            Trivia Game
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" end className={navClass}>
              <Gamepad2 className="size-4" /> <span className="hidden sm:inline">Host</span>
            </NavLink>
            <NavLink to="/quizzes" className={navClass}>
              <BookOpen className="size-4" /> <span className="hidden sm:inline">Quizzes</span>
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
