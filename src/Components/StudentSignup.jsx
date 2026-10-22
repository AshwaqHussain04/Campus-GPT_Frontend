import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, saveAuthSession, signupStudent } from '../api/client'
import { LoadingSpinner } from './LoadingSpinner'
import AuthLayout, { PasswordField } from './AuthLayout'

export default function StudentSignup() {
  const [form, setForm] = useState({ name: '', email: '', regNo: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setFieldError('')
    if (form.password !== confirmPassword) {
      setFieldError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setFieldError('Use at least 8 characters for your password.')
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
    <AuthLayout eyebrow="Student access" title="Create your account" description="Use your student details to get started with Campus-GPT." footer={<>Already registered? <Link to="/student/login">Sign in</Link></>}>
      <form className="auth-form" onSubmit={handleSubmit}>
          <label>Full name<input name="name" value={form.name} onChange={updateField} required autoComplete="name" /></label>
          <label>Student email<input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" /></label>
          <label>Registration number<input name="regNo" type="number" value={form.regNo} onChange={updateField} required /></label>
          <PasswordField label="Password" name="password" value={form.password} onChange={updateField} autoComplete="new-password" error={fieldError && form.password.length < 8 ? fieldError : ''} />
          <PasswordField label="Confirm password" name="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" error={fieldError && form.password === confirmPassword ? fieldError : ''} />
          {fieldError && <p className="auth-error" role="alert">{fieldError}</p>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="campus-btn campus-btn-primary w-100" type="submit" disabled={loading}>
            {loading ? <><LoadingSpinner size="small" label="Creating account" /><span>Creating account...</span></> : 'Create student account'}
          </button>
        </form>
    </AuthLayout>
  )
}