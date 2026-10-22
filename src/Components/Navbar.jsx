import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getStoredUserName, getTokenRole, logoutUser } from '../api/client'

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('campusgpt-theme') === 'dark'
  })

  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState(() => getStoredUserName())
  const [userRole, setUserRole] = useState(() => getTokenRole())
  const navActionsRef = useRef(null)
  const navShellRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navShellRef.current && !navShellRef.current.contains(event.target)) {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }

    const handleAuthChange = () => {
      setUserName(getStoredUserName())
      setUserRole(getTokenRole())
      setOpenMenu(null)
      setMobileOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('campusgpt-auth-change', handleAuthChange)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('campusgpt-auth-change', handleAuthChange)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('campusgpt-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function handleLogout() {
    logoutUser()
    navigate('/')
  }

  const dashboardRoute = userRole === 'admin' ? '/admin/upload' : '/chat'
  const accountLabel = userRole === 'admin' ? 'Admin' : 'Student'

  return (
    <header className="topbar">
      <div className={`container nav-shell ${mobileOpen ? 'mobile-menu-open' : ''}`} ref={navShellRef}>
        <Link to="/" className="brand-mark">
          <span className="brand-badge">CG</span>
          <span>Campus-GPT</span>
        </Link>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
          onClick={() => {
            setMobileOpen((open) => !open)
            setOpenMenu(null)
          }}
        >
          <span />
          <span />
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
        </button>

        <nav id="primary-navigation" className="nav-links" aria-label="Primary navigation">
          <NavLink to="/" end onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>
          {userRole === 'student' && <NavLink to="/chat" onClick={() => setMobileOpen(false)}>AI Chat</NavLink>}
          {userRole === 'admin' && <NavLink to="/admin/upload" onClick={() => setMobileOpen(false)}>Documents</NavLink>}
          {!userRole && <NavLink to="/chat" onClick={() => setMobileOpen(false)}>AI Chat</NavLink>}
          <NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
        </nav>

        <div className="nav-actions" ref={navActionsRef}>
          <button className="theme-toggle" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dark mode">
            {darkMode ? '☀︎' : '☾'}
          </button>

          {userRole ? (
            <div className="nav-user-controls">
              <Link to={dashboardRoute} className="nav-account-button" aria-label={`${accountLabel} dashboard for ${userName}`} onClick={() => setMobileOpen(false)}>
                {accountLabel}
              </Link>
              <button type="button" className="nav-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
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
                    <Link to="/student/login" onClick={() => { setOpenMenu(null); setMobileOpen(false) }}>Student login</Link>
                    <Link to="/student/signup" onClick={() => { setOpenMenu(null); setMobileOpen(false) }}>Student signup</Link>
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
                    <Link to="/admin/login" onClick={() => { setOpenMenu(null); setMobileOpen(false) }}>Admin login</Link>
                    <Link to="/admin/signup" onClick={() => { setOpenMenu(null); setMobileOpen(false) }}>Admin signup</Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

