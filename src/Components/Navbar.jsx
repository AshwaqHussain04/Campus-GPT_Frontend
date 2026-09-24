import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('campusgpt-theme') === 'dark'
  })

  const [openMenu, setOpenMenu] = useState(null)
  const navActionsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navActionsRef.current && !navActionsRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

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

        <div className="nav-actions" ref={navActionsRef}>
          <button className="theme-toggle" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dark mode">
            {darkMode ? '☀︎' : '☾'}
          </button>
          <div className="nav-menu">
            <button
              type="button"
              className="nav-menu-toggle nav-pill"
              aria-expanded={openMenu === 'student'}
              onClick={() => setOpenMenu((menu) => (menu === 'student' ? null : 'student'))}
            >
              Student
            </button>
            {openMenu === 'student' && (
            <div className="nav-menu-panel">
              <Link to="/student/login">Sign in</Link>
              <Link to="/student/signup">Sign up</Link>
            </div>
            )}
          </div>
          <div className="nav-menu">
            <button
              type="button"
              className="nav-menu-toggle nav-pill nav-pill-accent"
              aria-expanded={openMenu === 'admin'}
              onClick={() => setOpenMenu((menu) => (menu === 'admin' ? null : 'admin'))}
            >
              Admin
            </button>
            {openMenu === 'admin' && (
            <div className="nav-menu-panel">
              <Link to="/admin/login">Sign in</Link>
              <Link to="/admin/signup">Sign up</Link>
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

