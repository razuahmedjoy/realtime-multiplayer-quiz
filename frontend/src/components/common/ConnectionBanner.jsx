import { useGameStore } from '@/store/gameStore'

const ConnectionBanner = () => {
  const connected = useGameStore((s) => s.connected)
  if (connected) return null
  return <div className="border-b border-line bg-warn-soft py-1.5 text-center text-sm text-warn">Connecting to the game server...</div>
}

export default ConnectionBanner
