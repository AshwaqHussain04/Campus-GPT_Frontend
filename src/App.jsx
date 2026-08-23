import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Chat from './Components/Chat'
import AdminLogin from './Components/AdminLogin'
import AdminUpload from './Components/AdminUpload'
import ProtectedRoute from './Components/ProtectedRoute'
import Button from './Components/Button'
import FeatureCard from './Components/FeatureCard'
import StatCard from './Components/StatCard'
import TestimonialCard from './Components/TestimonialCard'
import FAQAccordion from './Components/FAQAccordion'
import HomePage from './Components/HomePage'
import LoginPage from "./Components/Login"
import AboutPage from './Components/About'
import SignupPage from "./Components/Signup"


function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute>
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
                <li><Link to="/login">Login</Link></li>
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