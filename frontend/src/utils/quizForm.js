// Converts between the API shape and the editor's form shape.
// The API stores the answer as option text; the editor works with its index.

export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 4

export const emptyQuestion = () => ({ question: '', options: ['', '', '', ''], answerIndex: 0, timeLimit: '' })

export const emptyQuizForm = () => ({ name: '', description: '', questions: [emptyQuestion()] })

export const quizToForm = (quiz) => ({
  name: quiz.name,
  description: quiz.description || '',
  questions: quiz.questions.map((q) => ({
    question: q.question,
    options: [...q.options],
    answerIndex: Math.max(0, q.options.indexOf(q.answer)),
    timeLimit: q.timeLimit || '',
  })),
})

export const formToQuiz = (form) => ({
  name: form.name,
  description: form.description,
  questions: form.questions.map((q) => ({
    question: q.question,
    options: q.options,
    answer: q.options[q.answerIndex],
    ...(q.timeLimit && { timeLimit: q.timeLimit }),
  })),
})

export const toExportJson = ({ name, description, category, questions }) => ({ name, description, category, questions })

export const exportFileName = (name) => `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`
