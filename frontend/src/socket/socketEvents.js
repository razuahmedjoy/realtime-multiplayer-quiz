// Socket.IO event names, shared by the hooks so nothing is a magic string.

// client -> server
export const CLIENT_EVENTS = {
  hostJoin: 'hostJoin',
  startQuiz: 'startQuiz',
  revealAnswer: 'revealAnswer',
  nextQuestion: 'nextQuestion',
  endQuiz: 'endQuiz',
  restartQuiz: 'restartQuiz',
  kickPlayer: 'kickPlayer',
  joinLobby: 'joinLobby',
  submitAnswer: 'submitAnswer',
}

// server -> client
export const SERVER_EVENTS = {
  lobbyState: 'lobbyState',
  newQuestion: 'newQuestion',
  answerProgress: 'answerProgress',
  questionEnded: 'questionEnded',
  quizEnded: 'quizEnded',
  kicked: 'kicked',
}
