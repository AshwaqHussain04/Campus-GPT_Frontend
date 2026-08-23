import { useState } from 'react'
import Button from './Button'

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState('student')

  return (
    <main className="container auth-page">
      <div className="auth-card">
        <div className="auth-role-switch">
          <button className={activeRole === 'student' ? 'role-card active' : 'role-card'} onClick={() => setActiveRole('student')}>
            <strong>Student Login</strong>
            <span>College account access</span>
          </button>
          <button className={activeRole === 'faculty' ? 'role-card active' : 'role-card'} onClick={() => setActiveRole('faculty')}>
            <strong>Faculty Login</strong>
            <span>Department access</span>
          </button>
        </div>

        <form className="auth-form">
          <label>
            College Email
            <input type="email" placeholder="name@college.edu" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Enter password" />
          </label>
          <div className="form-row">
            <label className="checkbox-row">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <Button className="w-100">Continue</Button>
          <button type="button" className="social-btn">Continue with Google</button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage