import { create } from 'zustand'

// Live state of the game currently on screen, filled by socket events (see useGameSocket).
const initialState = {
  connected: false,
  lobbyState: null, // players, teams, status: waiting | question | reveal | finished
  question: null, // current question (never contains the answer)
  myAnswer: null, // player only: the option this device picked
  progress: { answeredCount: 0, playerCount: 0 },
  reveal: null, // results of the last question
  results: null, // final results
  clockOffset: 0, // server time - local time, keeps countdowns in sync
  kicked: false,
}

export const useGameStore = create((set) => ({
  ...initialState,

  setConnected: (connected) => set({ connected }),
  setLobbyState: (lobbyState) => set({ lobbyState }),
  receiveQuestion: (question) =>
    set({
      question,
      myAnswer: question.yourAnswer || null,
      progress: { answeredCount: question.answeredCount, playerCount: question.playerCount },
      clockOffset: question.serverTime - Date.now(),
    }),
  setProgress: (progress) => set({ progress }),
  setReveal: (reveal) => set({ reveal }),
  setResults: (results) => set({ results }),
  setMyAnswer: (myAnswer) => set({ myAnswer }),
  setKicked: () => set({ kicked: true }),
  reset: () => set(initialState),
}))
