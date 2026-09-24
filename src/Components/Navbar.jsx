import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('campusgpt-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('campusgpt-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <header className="topbar">
      <div className="container nav-shell">
        <Link to="/" className="brand-mark">
          <span className="brand-badge">CG</span>
          <span>Campus-GPT</span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/chat">AI Chat</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dark mode">
            {darkMode ? '☀︎' : '☾'}
          </button>
          <Link to="/login" className="nav-pill">
            Login
          </Link>
          <Link to="/signup" className="nav-pill nav-pill-accent">
            Signup
          </Link>
          <Link to="/test/signup" className="nav-pill nav-pill-accent">
            Test Signup
          </Link>
        </div>
      </div>
    </header>
  )
}

