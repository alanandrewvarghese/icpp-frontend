import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const AuthCheck = ({
  children,
  fallback = null,
  unauthenticatedFallback = null,
  allowedRoles = [],
}) => {
  const { user } = useContext(AuthContext)

  // Check if user is authenticated
  const isAuthenticated = user?.role && user.role !== 'guest'

  // Check if user has an allowed role (if roles are specified)
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(user?.role)

  // Render unauthenticatedFallback if user is not authenticated
  if (!isAuthenticated) {
    return unauthenticatedFallback
  }

  // Render children if authenticated and has required role, else render fallback
  return hasRequiredRole ? children : fallback
}

export default AuthCheck
