import { Link } from 'react-router-dom'
import { LoadingSpinner } from './LoadingSpinner'

export default function Button({ children, to, onClick, variant = 'primary', className = '', loading = false, disabled, ...props }) {
  const baseClass = 'campus-btn'
  const variantClass =
    variant === 'secondary'
      ? 'campus-btn-secondary'
      : variant === 'ghost'
        ? 'campus-btn-ghost'
        : 'campus-btn-primary'

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${variantClass} ${className}`.trim()} aria-busy={loading || undefined} {...props}>
        {loading && <LoadingSpinner size="small" label="Loading" />}
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={`${baseClass} ${variantClass} ${className}`.trim()} onClick={onClick} disabled={loading || disabled} aria-busy={loading || undefined} {...props}>
      {loading && <LoadingSpinner size="small" label="Loading" />}
      {children}
    </button>
  )
}
