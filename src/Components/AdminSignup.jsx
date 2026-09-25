import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, saveAuthSession, signupAdmin } from '../api/client'

export default function AdminSignup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await signupAdmin(form)
      saveAuthSession(data.access_token, data.name || form.name, 'admin')
      navigate('/admin/upload')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container auth-page">
      <div className="auth-card auth-card-narrow">
        <p className="eyebrow">Administrator access</p>
        <h1>Create an admin account</h1>
        <p className="auth-intro">Admin signup requires an existing admin token on the backend.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Username<input name="name" value={form.name} onChange={updateField} required autoComplete="username" /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={updateField} required autoComplete="new-password" /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create admin account'}
          </button>
        </form>
        <p className="auth-switch">Already have access? <Link to="/admin/login">Sign in</Link></p>
      </div>
    </main>
  )
}