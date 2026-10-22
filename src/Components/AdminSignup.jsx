import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, saveAuthSession, signupAdmin } from '../api/client'
import { LoadingSpinner } from './LoadingSpinner'
import AuthLayout, { PasswordField } from './AuthLayout'

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
    <AuthLayout eyebrow="Admin access" title="Create an admin account" description="Create an admin account to manage official Campus-GPT knowledge sources." footer={<>Already have access? <Link to="/admin/login">Sign in</Link></>}>
      <form className="auth-form" onSubmit={handleSubmit}>
          <label>Username<input name="name" value={form.name} onChange={updateField} required autoComplete="username" /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" /></label>
          <PasswordField label="Password" name="password" value={form.password} onChange={updateField} autoComplete="new-password" />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
            {loading ? <><LoadingSpinner size="small" label="Creating account" /><span>Creating account...</span></> : 'Create admin account'}
          </button>
        </form>
    </AuthLayout>
  )
}