const SAMPLE = `{
  "name": "My Quiz",
  "description": "Optional",
  "questions": [
    {
      "question": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "answer": "Paris",
      "timeLimit": 20
    }
  ]
}`

const JsonFormatHelp = () => (
  <details className="card mt-6 px-4 py-3 text-sm text-muted">
    <summary className="cursor-pointer font-medium text-ink">JSON format for importing</summary>
    <pre className="mt-3 overflow-x-auto rounded-md bg-subtle p-4 font-mono text-xs text-ink">{SAMPLE}</pre>
    <p className="mt-3">
      Each question needs 2-4 options. <code className="font-mono text-ink">answer</code> is the correct option&apos;s text (or its index).{' '}
      <code className="font-mono text-ink">timeLimit</code> is optional.
    </p>
  </details>
)

export default JsonFormatHelp
