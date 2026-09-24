import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup_admin } from '../api/client'

export default function AdminLogin() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await signup_admin(username, password)
      localStorage.setItem('campusgpt_token', data.access_token)
      navigate('/admin/upload')
    } catch (err) {
      setError('Incorrect username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4">Admin Signup</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="mail"
            className="form-control"
            value={email}
            placeholder="admin123@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}