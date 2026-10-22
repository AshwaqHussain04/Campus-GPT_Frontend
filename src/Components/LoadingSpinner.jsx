export function LoadingSpinner({ size = 'medium', label = 'Loading' }) {
  const sizeMap = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  }

  return (
    <div className="spinner-wrap" role="status" aria-live="polite" aria-label={label}>
      <span className={`spinner ${sizeMap[size] || sizeMap.medium}`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function PageLoader({ message = 'Loading Campus-GPT…' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader-card">
        <LoadingSpinner size="large" label={message} />
        <p>{message}</p>
      </div>
    </div>
  )
}
