import { useState } from 'react'

export function PasswordField({ label = 'Password', name = 'password', value, onChange, autoComplete = 'current-password', error }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="password-field">
      <span>{label}</span>
      <span className="password-input-wrap">
        <input
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : undefined}
        />
        <button type="button" className="password-toggle" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Hide password' : 'Show password'}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </span>
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <main className="container auth-page">
      <div className="auth-card auth-card-narrow">
        <div className="auth-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-intro">{description}</p>
        </div>
        {children}
        {footer && <p className="auth-switch">{footer}</p>}
      </div>
    </main>
  )
}
