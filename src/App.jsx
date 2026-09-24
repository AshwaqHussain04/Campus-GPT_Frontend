import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
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


function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ProtectedRoute requiredRole="student"><Chat /></ProtectedRoute>} />
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
              <ProtectedRoute requiredRole="admin">
                <AdminUpload />
              </ProtectedRoute>
            }
          />
        </Routes>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <h3>Campus-GPT</h3>
              <p>Helpful academic assistance, campus guidance, and administrative support in one calm experience.</p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/chat">AI Chat</Link></li>
                <li><Link to="/student/login">Student login</Link></li>
                <li><Link to="/admin/login">Admin login</Link></li>
              </ul>
            </div>
            <div>
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App