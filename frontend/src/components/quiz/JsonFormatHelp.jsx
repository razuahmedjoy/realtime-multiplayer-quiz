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
  <details className="card mt-6 p-5 text-sm text-white/60">
    <summary className="cursor-pointer font-semibold text-white">JSON format for importing</summary>
    <pre className="mt-3 overflow-x-auto rounded-xl bg-black/30 p-4 text-xs text-white/80">{SAMPLE}</pre>
    <p className="mt-2">
      Each question needs 2-4 options. <code>answer</code> is the correct option&apos;s text (or its index). <code>timeLimit</code> is optional.
    </p>
  </details>
)

export default JsonFormatHelp
