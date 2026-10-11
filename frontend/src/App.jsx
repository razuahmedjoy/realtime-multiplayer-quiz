import { Route, Routes } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import QuizListPage from '@/pages/QuizListPage'
import QuizEditorPage from '@/pages/QuizEditorPage'
import HostGamePage from '@/pages/HostGamePage'
import PlayerGamePage from '@/pages/PlayerGamePage'
import NotFoundPage from '@/pages/NotFoundPage'

const App = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="quizzes" element={<QuizListPage />} />
      <Route path="quizzes/new" element={<QuizEditorPage key="new" />} />
      <Route path="quizzes/:quizId/edit" element={<QuizEditorPage key="edit" />} />
      <Route path="lobby-leader/:lobbyId" element={<HostGamePage />} />
      <Route path="player/:lobbyId" element={<PlayerGamePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
)

export default App
