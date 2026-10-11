import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Plus, Save } from 'lucide-react'
import LoadingSpinner from '@/components/common/Loading'
import Message from '@/components/common/Message'
import { useCreateQuiz, useQuiz, useUpdateQuiz } from '@/hooks/useQuizzes'
import { emptyQuestion, emptyQuizForm, formToQuiz, quizToForm } from '@/utils/quizForm'
import QuestionCard from '@/components/quiz/QuestionCard'

/** The form itself. Receives its starting values, so it never has to sync with the query. */
const QuizEditorForm = ({ quizId, initialForm }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const createQuiz = useCreateQuiz()
  const updateQuiz = useUpdateQuiz()
  const saving = createQuiz.isPending || updateQuiz.isPending

  const setQuestions = (questions) => setForm({ ...form, questions })

  const handleSave = (e) => {
    e.preventDefault()
    const quiz = formToQuiz(form)
    const options = {
      onSuccess: () => {
        toast.success('Quiz saved')
        navigate('/quizzes')
      },
      onError: (err) => toast.error(err.message), // the server explains exactly what's wrong
    }
    if (quizId) updateQuiz.mutate({ id: quizId, quiz }, options)
    else createQuiz.mutate(quiz, options)
  }

  return (
    <form onSubmit={handleSave} className="mx-auto w-full max-w-3xl px-4 pt-10 pb-28">
      <h1 className="mb-6 text-3xl font-bold">{quizId ? 'Edit quiz' : 'Create a quiz'}</h1>

      <div className="card mb-6 space-y-4 p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-white/80">Quiz name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} className="input" placeholder="e.g. Office Trivia Night" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-white/80">Description (optional)</span>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={200} className="input" />
        </label>
      </div>

      <div className="space-y-4">
        {form.questions.map((q, i) => (
          <QuestionCard
            key={i}
            question={q}
            index={i}
            total={form.questions.length}
            onChange={(next) => setQuestions(form.questions.map((x, j) => (j === i ? next : x)))}
            onMove={(dir) => {
              const next = [...form.questions]
              ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
              setQuestions(next)
            }}
            onRemove={() => setQuestions(form.questions.filter((_, j) => j !== i))}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setQuestions([...form.questions, emptyQuestion()])}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 py-4 font-medium text-white/60 hover:border-indigo-400 hover:text-white"
      >
        <Plus className="size-5" /> Add question
      </button>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-night-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="text-sm text-white/50">{form.questions.length} questions</span>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={() => navigate('/quizzes')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save className="size-4" /> {saving ? 'Saving...' : 'Save quiz'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

const QuizEditorPage = () => {
  const { quizId } = useParams()
  const [searchParams] = useSearchParams()
  const copyFromId = searchParams.get('from') // duplicate an existing (e.g. built-in) quiz
  const sourceId = quizId || copyFromId
  const { data: source, isPending, error } = useQuiz(sourceId)

  if (!sourceId) return <QuizEditorForm initialForm={emptyQuizForm()} />
  if (error) return <Message title="Couldn't load quiz" text={error.message} />
  if (isPending) return <LoadingSpinner />

  const initialForm = quizToForm(source)
  if (!quizId) initialForm.name = `${initialForm.name} (copy)`
  return <QuizEditorForm key={sourceId} quizId={quizId} initialForm={initialForm} />
}

export default QuizEditorPage
