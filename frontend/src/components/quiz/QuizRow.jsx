import { Copy, Download, Pencil, Trash2 } from 'lucide-react'

const iconBtn = 'rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white'

/** One quiz in the manager list with its actions. Built-in quizzes can only be duplicated. */
const QuizRow = ({ quiz, onEdit, onDuplicate, onExport, onDelete }) => (
  <div className="flex flex-wrap items-center gap-4 p-4">
    <div className="min-w-0 flex-1">
      <p className="font-semibold">
        {quiz.name}
        {quiz.isBuiltIn && <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-200">Built-in</span>}
      </p>
      <p className="truncate text-sm text-white/50">
        {quiz.questionCount} questions{quiz.description && ` · ${quiz.description}`}
      </p>
    </div>
    <div className="flex">
      {quiz.isBuiltIn ? (
        <button className={iconBtn} title="Duplicate and edit" onClick={() => onDuplicate(quiz)}>
          <Copy className="size-4" />
        </button>
      ) : (
        <button className={iconBtn} title="Edit" onClick={() => onEdit(quiz)}>
          <Pencil className="size-4" />
        </button>
      )}
      <button className={iconBtn} title="Export JSON" onClick={() => onExport(quiz)}>
        <Download className="size-4" />
      </button>
      {!quiz.isBuiltIn && (
        <button className={`${iconBtn} hover:text-rose-300`} title="Delete" onClick={() => onDelete(quiz)}>
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  </div>
)

export default QuizRow
