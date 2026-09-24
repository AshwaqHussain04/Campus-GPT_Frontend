import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, loginAdmin } from '../api/client'

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
      localStorage.setItem('campusgpt_token', data.access_token)
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
        <h1>Login to admin account</h1>
        <p className="auth-intro">Use your admin username and password to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          Need access? <Link to="/admin/signup">Create admin account</Link>
        </p>
      </div>
    </main>
  )
}
