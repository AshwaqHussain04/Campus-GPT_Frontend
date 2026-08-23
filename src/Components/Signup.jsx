import { useState } from 'react'
import Button from './Button'

const SignupPage = () => {
  const [activeRole, setActiveRole] = useState('student')
  const [password, setPassword] = useState('')

  const strength = password.length > 10 ? 'Strong' : password.length > 6 ? 'Medium' : 'Weak'

  return (
    <main className="container auth-page">
      <div className="auth-card">
        <div className="auth-role-switch">
          <button className={activeRole === 'student' ? 'role-card active' : 'role-card'} onClick={() => setActiveRole('student')}>
            <strong>Student Signup</strong>
            <span>New student account</span>
          </button>
          <button className={activeRole === 'faculty' ? 'role-card active' : 'role-card'} onClick={() => setActiveRole('faculty')}>
            <strong>Faculty Signup</strong>
            <span>Professional profile</span>
          </button>
        </div>

        <form className="auth-form">
          {activeRole === 'student' ? (
            <>
              <label>
                Full Name
                <input type="text" placeholder="Aarav Sharma" />
              </label>
              <label>
                College Email
                <input type="email" placeholder="aarav@college.edu" />
              </label>
              <label>
                Roll Number
                <input type="text" placeholder="CS2024001" />
              </label>
              <label>
                Department
                <input type="text" placeholder="Computer Science" />
              </label>
            </>
          ) : (
            <>
              <label>
                Full Name
                <input type="text" placeholder="Dr. Meera Rao" />
              </label>
              <label>
                College Email
                <input type="email" placeholder="meera@college.edu" />
              </label>
              <label>
                Employee ID
                <input type="text" placeholder="EMP-2048" />
              </label>
              <label>
                Department
                <input type="text" placeholder="Mathematics" />
              </label>
            </>
          )}
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" />
          </label>
          <div className="strength-meter">
            <span>Strength: {strength}</span>
            <div className="meter-bar">
              <span className={`meter-fill ${strength.toLowerCase()}`} />
            </div>
          </div>
          <label>
            Confirm Password
            <input type="password" placeholder="Repeat password" />
          </label>
          <Button className="w-100">Create account</Button>
          <button type="button" className="social-btn">Sign up with Google</button>
        </form>
      </div>
    </main>
  )
}

export default SignupPage