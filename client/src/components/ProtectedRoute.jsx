import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name')

  // Check if user is logged in
  if (!name) {
    return <Navigate to="/login" replace />
  }

  // Check if specific role is required
  if (requiredRole && role !== requiredRole) {
    // Admin can access teacher routes
    if (requiredRole === 'teacher' && role === 'admin') {
      return children
    }
    // Redirect to appropriate dashboard
    if (role === 'admin') {
      return <Navigate to="/admin_dashboard" replace />
    }
    if (role === 'teacher') {
      return <Navigate to="/teacher_dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

