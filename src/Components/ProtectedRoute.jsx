import { Navigate } from 'react-router-dom'

function getTokenRole() {
  const token = localStorage.getItem('campusgpt_token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

export default function ProtectedRoute({ children, requiredRole }) {
  const role = getTokenRole()
  if (!role) return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/student/login'} replace />
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin/upload' : '/chat'} replace />
  }
  return children
}