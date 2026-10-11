import { useGameStore } from '@/store/gameStore'

const ConnectionBanner = () => {
  const connected = useGameStore((s) => s.connected)
  if (connected) return null
  return <div className="bg-amber-500/20 py-1.5 text-center text-sm text-amber-200">Connecting to the game server...</div>
}

export default ConnectionBanner
