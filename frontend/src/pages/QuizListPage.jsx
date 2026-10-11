import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Plus, Upload } from 'lucide-react'
import LoadingSpinner from '@/components/common/Loading'
import Message from '@/components/common/Message'
import { downloadJson } from '@/utils/helpers'
import { useCreateQuiz, useDeleteQuiz, useFetchQuiz, useQuizzes } from '@/hooks/useQuizzes'
import { exportFileName, toExportJson } from '@/utils/quizForm'
import QuizRow from '@/components/quiz/QuizRow'
import JsonFormatHelp from '@/components/quiz/JsonFormatHelp'

const QuizListPage = () => {
  const navigate = useNavigate()
  const fileInput = useRef(null)
  const { data: quizzes, isPending, error } = useQuizzes()
  const createQuiz = useCreateQuiz()
  const deleteQuiz = useDeleteQuiz()
  const fetchQuiz = useFetchQuiz()

  // Import: a JSON file with { name, questions: [{ question, options, answer }] }
  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    let data
    try {
      data = JSON.parse(await file.text())
    } catch {
      return toast.error('That file is not valid JSON')
    }
    createQuiz.mutate(data, {
      onSuccess: () => toast.success(`Imported "${data.name || data.title}"`),
      onError: (err) => toast.error(err.message),
    })
  }

  const handleExport = async (quiz) => {
    try {
      const full = await fetchQuiz(quiz._id)
      downloadJson(exportFileName(full.name), toExportJson(full))
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = (quiz) => {
    if (!window.confirm(`Delete "${quiz.name}"? This can't be undone.`)) return
    deleteQuiz.mutate(quiz._id, {
      onSuccess: () => toast.success('Quiz deleted'),
      onError: (err) => toast.error(err.message),
    })
  }

  if (isPending) return <LoadingSpinner label="Loading quizzes..." />
  if (error) return <Message title="Couldn't load quizzes" text={error.message} />

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Quizzes</h1>
          <p className="mt-1 text-muted">Built-in question sets and the quizzes you&apos;ve created or imported.</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileInput} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
          <button className="btn-secondary" onClick={() => fileInput.current?.click()} disabled={createQuiz.isPending}>
            <Upload className="size-4" /> {createQuiz.isPending ? 'Importing...' : 'Import JSON'}
          </button>
          <Link to="/quizzes/new" className="btn-primary">
            <Plus className="size-4" /> New quiz
          </Link>
        </div>
      </div>

      <div className="card divide-y divide-line">
        {quizzes.length === 0 && <p className="p-8 text-center text-muted">No quizzes yet.</p>}
        {quizzes.map((quiz) => (
          <QuizRow
            key={quiz._id}
            quiz={quiz}
            onEdit={() => navigate(`/quizzes/${quiz._id}/edit`)}
            onDuplicate={() => navigate(`/quizzes/new?from=${quiz._id}`)}
            onExport={handleExport}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <JsonFormatHelp />
    </div>
  )
}

export default QuizListPage
