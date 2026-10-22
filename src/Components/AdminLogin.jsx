import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, loginAdmin, saveAuthSession } from '../api/client'
import { LoadingSpinner } from './LoadingSpinner'
import AuthLayout, { PasswordField } from './AuthLayout'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginAdmin(username, password)
      saveAuthSession(data.access_token, data.name || username, 'admin')
      navigate('/admin/upload')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout eyebrow="Admin access" title="Welcome back, Admin" description="Sign in to manage Campus-GPT knowledge sources." footer={<>Need access? <Link to="/admin/signup">Create admin account</Link></>}>
      <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" />
          </label>
          <PasswordField value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
            {loading ? <><LoadingSpinner size="small" label="Signing in" /><span>Signing in...</span></> : 'Sign in as admin'}
          </button>
        </form>
    </AuthLayout>
  )
}
