import { Route, Routes } from "react-router"
import Home from "./components/Home"
import LobbyLeader from "./components/LobbyLeader"
import Player from "./components/Player"
import Layout from "./Layout/Layout"
import WaitingRoom from "./components/WaitingRoom"

function App() {



  return (
    <>
   

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lobby-leader/:lobbyId" element={<LobbyLeader />} />
          <Route path="player/:lobbyId" element={<Player />} />
          <Route path="waiting-room/:lobbyId" element={<WaitingRoom />} />

        </Route>

      </Routes>
    </>
  )
}

export default App
