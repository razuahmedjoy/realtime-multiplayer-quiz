const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-sm text-muted">
      <div className="size-8 animate-spin rounded-full border-2 border-line border-t-brand" />
      {label}
    </div>
  )
}

export default LoadingSpinner
