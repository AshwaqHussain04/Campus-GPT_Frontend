import { Link } from 'react-router-dom'

export default function Button({ children, to, onClick, variant = 'primary', className = '', ...props }) {
  const baseClass = 'campus-btn'
  const variantClass =
    variant === 'secondary'
      ? 'campus-btn-secondary'
      : variant === 'ghost'
        ? 'campus-btn-ghost'
        : 'campus-btn-primary'

  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${variantClass} ${className}`.trim()} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={`${baseClass} ${variantClass} ${className}`.trim()} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
