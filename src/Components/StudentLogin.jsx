import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, loginStudent } from '../api/client'

export default function StudentLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginStudent(email, password)
      localStorage.setItem('campusgpt_token', data.access_token)
      navigate('/chat')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container auth-page">
      <div className="auth-card auth-card-narrow">
        <p className="eyebrow">Student access</p>
        <h1>Welcome back</h1>
        <p className="auth-intro">Sign in to ask questions and continue your campus conversations.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Student email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in as student'}
          </button>
        </form>
        <p className="auth-switch">New student? <Link to="/student/signup">Create an account</Link></p>
      </div>
    </main>
  )
}