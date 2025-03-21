import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { CircularProgress, Box } from '@mui/material'

const AuthCheck = ({
  children,
  fallback = null,
  unauthenticatedFallback = null,
  allowedRoles = [],
  createdBy = null, // Add a new prop to check creator
  allowedInstructor = null, // Add prop for specific instructor who should have access
}) => {
  const { user, isLoading } = useContext(AuthContext)
  const [authChecked, setAuthChecked] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Only mark as checked when we're sure authentication state is loaded
    if (!isLoading) {
      setAuthChecked(true)
    }
  }, [isLoading, user])

  // Add minimum loading time of 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Show loading indicator while authentication is being checked or minimum time hasn't elapsed
  if (!authChecked || isLoading || showLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  // Check if user is authenticated
  const isAuthenticated = user?.role && user.role !== 'guest'

  // Check if user has an allowed role (if roles are specified)
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(user?.role)

  // Check if user is the creator, an admin, or the specific allowed instructor
  const isAuthorized =
    !createdBy ||
    user?.username === createdBy ||
    user?.role === 'admin' ||
    (allowedInstructor && user?.username === allowedInstructor)

  // Render unauthenticatedFallback if user is not authenticated
  if (!isAuthenticated) {
    return unauthenticatedFallback
  }

  // Render children if authenticated, has required role, and is creator/admin/allowed instructor
  // Otherwise render fallback
  return hasRequiredRole && isAuthorized ? children : fallback
}

export default AuthCheck
