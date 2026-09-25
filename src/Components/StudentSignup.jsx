import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, saveAuthSession, signupStudent } from '../api/client'

export default function StudentSignup() {
  const [form, setForm] = useState({ name: '', email: '', regNo: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (form.password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const data = await signupStudent(form)
      saveAuthSession(data.access_token, data.name || form.name, 'student')
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
        <h1>Create your account</h1>
        <p className="auth-intro">Use your student details to get started with Campus-GPT.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Full name<input name="name" value={form.name} onChange={updateField} required autoComplete="name" /></label>
          <label>Student email<input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" /></label>
          <label>Registration number<input name="regNo" type="number" value={form.regNo} onChange={updateField} required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={updateField} required autoComplete="new-password" /></label>
          <label>Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required autoComplete="new-password" /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create student account'}
          </button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/student/login">Sign in</Link></p>
      </div>
    </main>
  )
}