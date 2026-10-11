import { Circle, Diamond, Square, Triangle } from 'lucide-react'

export const TEAMS = {
  red: { label: 'Red', bg: 'bg-rose-500', soft: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-400' },
  blue: { label: 'Blue', bg: 'bg-sky-500', soft: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-400' },
  green: { label: 'Green', bg: 'bg-emerald-500', soft: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-400' },
  yellow: { label: 'Yellow', bg: 'bg-amber-400', soft: 'bg-amber-400/15', text: 'text-amber-300', border: 'border-amber-300' },
}

// Answer buttons get a colour and a shape, so they're distinguishable without colour.
export const ANSWER_STYLES = [
  { bg: 'bg-indigo-500', Icon: Triangle },
  { bg: 'bg-fuchsia-500', Icon: Diamond },
  { bg: 'bg-teal-500', Icon: Circle },
  { bg: 'bg-orange-500', Icon: Square },
]

export const TIME_LIMITS = [10, 15, 20, 30, 45, 60]
