import { Copy, Download, Pencil, Trash2 } from 'lucide-react'

const iconBtn = 'rounded-md p-2 text-muted transition-colors hover:bg-subtle hover:text-ink'

/** One quiz in the manager list with its actions. Built-in quizzes can only be duplicated. */
const QuizRow = ({ quiz, onEdit, onDuplicate, onExport, onDelete }) => (
  <div className="flex flex-wrap items-center gap-4 px-4 py-3">
    <div className="min-w-0 flex-1">
      <p className="font-medium">
        {quiz.name}
        {quiz.isBuiltIn && <span className="ml-2 rounded bg-subtle px-1.5 py-0.5 text-xs font-normal text-muted">Built-in</span>}
      </p>
      <p className="truncate text-sm text-muted">
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
        <button className={`${iconBtn} hover:bg-danger-soft hover:text-danger`} title="Delete" onClick={() => onDelete(quiz)}>
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  </div>
)

export default QuizRow
