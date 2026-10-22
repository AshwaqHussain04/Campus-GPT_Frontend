import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, loginStudent, saveAuthSession } from '../api/client'
import { LoadingSpinner } from './LoadingSpinner'
import AuthLayout, { PasswordField } from './AuthLayout'

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
      saveAuthSession(data.access_token, data.name || email, 'student')
      navigate('/chat')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Student access"
      title="Welcome back"
      description="Sign in to continue your Campus-GPT conversations."
      footer={<>New student? <Link to="/student/signup">Create an account</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Student email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
        </label>
        <PasswordField value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
          {loading ? <><LoadingSpinner size="small" label="Signing in" /><span>Signing in...</span></> : 'Sign in as student'}
        </button>
      </form>
    </AuthLayout>
  )
}
