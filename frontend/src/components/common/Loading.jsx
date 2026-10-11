const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-white/60">
      <div className="size-12 animate-spin rounded-full border-4 border-indigo-400 border-r-transparent" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export default LoadingSpinner
