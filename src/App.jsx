import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './Components/Navbar'
import Chat from './Components/Chat'
import AdminLogin from './Components/AdminLogin'
import AdminSignup from './Components/AdminSignup'
import AdminUpload from './Components/AdminUpload'
import ProtectedRoute from './Components/ProtectedRoute'
import HomePage from './Components/HomePage'
import AboutPage from './Components/About'
import StudentLogin from './Components/StudentLogin'
import StudentSignup from './Components/StudentSignup'
import Footer from './Components/Footer'
import { PageLoader } from './Components/LoadingSpinner'

function AppRoutes() {
  const [authReady, setAuthReady] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const syncAuthState = () => setAuthReady(true)
    syncAuthState()

    window.addEventListener('campusgpt-auth-change', syncAuthState)

    return () => {
      window.removeEventListener('campusgpt-auth-change', syncAuthState)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.scrollBehavior = 'smooth'
    return () => {
      root.style.scrollBehavior = ''
    }
  }, [location.pathname])

  if (!authReady) {
    return <PageLoader message="Preparing your workspace…" />
  }

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ProtectedRoute requiredRole="student" authReady={authReady}><Chat /></ProtectedRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Navigate to="/student/login" replace />} />
        <Route path="/signup" element={<Navigate to="/student/signup" replace />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route
          path="/admin/upload"
          element={
            <ProtectedRoute requiredRole="admin" authReady={authReady}>
              <AdminUpload />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  )
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App