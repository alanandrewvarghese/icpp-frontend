import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AuthCheck from '../AuthCheck'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation()

  return (
    <AuthCheck
      allowedRoles={allowedRoles}
      unauthenticatedFallback={<Navigate to="/login" state={{ from: location }} replace />}
      fallback={<Navigate to="/" replace />}
    >
      {children}
    </AuthCheck>
  )
}

export default ProtectedRoute
