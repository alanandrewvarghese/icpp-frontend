import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import {
  login,
  registerStudent,
  registerInstructor,
  logout,
  refreshTokenService,
} from '../services/authService'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    // Restore user from localStorage if available
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log('AuthProvider.jsx - User restored from localStorage:', parsedUser)
      } catch (e) {
        console.error('AuthProvider.jsx - Error parsing stored user data:', e)
        localStorage.removeItem('user')
      }
    }

    const refreshAccessToken = async () => {
      console.log(
        'AuthProvider.jsx - No access token, but refresh token found. Attempting token refresh.',
      )
      try {
        const refreshResponse = await refreshTokenService()
        if (refreshResponse?.access) {
          setToken(refreshResponse.access)

          console.log('AuthProvider.jsx - Before localStorage.setItem("accessToken") - Refresh')
          try {
            localStorage.setItem('accessToken', refreshResponse.access)
            console.log(
              'AuthProvider.jsx - After localStorage.setItem("accessToken") - Refresh - Success',
            )
          } catch (e) {
            console.error(
              'AuthProvider.jsx - Error saving refreshed accessToken to localStorage:',
              e,
            )
          }

          console.log('AuthProvider.jsx - Access token refreshed successfully.')
        } else {
          // If refresh fails, clear any stale data
          clearAuthData()
        }
      } catch (error) {
        console.error('AuthProvider.jsx - Error refreshing token:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    if (storedAccessToken) {
      setToken(storedAccessToken)
      console.log('AuthProvider.jsx - Access token found in localStorage, persisting login state.')
      setIsLoading(false)
    } else if (storedRefreshToken) {
      refreshAccessToken()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Helper function to clear all auth data
  const clearAuthData = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  const loginContext = async (username, password) => {
    try {
      const response = await login(username, password)
      if (response.access) {
        setUser(response.user)
        setToken(response.access)

        console.log('AuthProvider.jsx - Before localStorage.setItem("accessToken")')
        try {
          localStorage.setItem('accessToken', response.access)
          console.log('AuthProvider.jsx - After localStorage.setItem("accessToken") - Success')
        } catch (e) {
          console.error('AuthProvider.jsx - Error saving accessToken to localStorage:', e)
        }

        console.log('AuthProvider.jsx - Before localStorage.setItem("refreshToken")')
        try {
          localStorage.setItem('refreshToken', response.refresh)
          console.log('AuthProvider.jsx - After localStorage.setItem("refreshToken") - Success')
        } catch (e) {
          console.error('AuthProvider.jsx - Error saving refreshToken to localStorage:', e)
        }

        console.log('AuthProvider.jsx - Before localStorage.setItem("user")')
        try {
          localStorage.setItem('user', JSON.stringify(response.user))
          console.log('AuthProvider.jsx - After localStorage.setItem("user") - Success')
        } catch (e) {
          console.error('AuthProvider.jsx - Error saving user to localStorage:', e)
        }

        console.log('AuthProvider.jsx - Login successful, tokens and user data set.')
      } else {
        console.log(
          'AuthProvider.jsx - Login failed (no access token in response data). Response:',
          response,
        )
      }
      return response
    } catch (error) {
      console.error('AuthProvider.jsx - Error during login:', error)
      throw error
    }
  }

  const registerStudentContext = async (username, password, email) => {
    console.log('AuthProvider.jsx - registerStudentContext called with:', username, email)
    try {
      const response = await registerStudent(username, password, email)
      console.log('AuthProvider.jsx - Response from registerStudent:', response)
      return response
    } catch (error) {
      console.error('AuthProvider.jsx - Error registering student:', error)
      throw error
    }
  }

  const registerInstructorContext = async (username, password, email) => {
    console.log('AuthProvider.jsx - registerInstructorContext called with:', username, email)
    try {
      const response = await registerInstructor(username, password, email)
      console.log('AuthProvider.jsx - Response from registerInstructor:', response)
      return response
    } catch (error) {
      console.error('AuthProvider.jsx - Error registering instructor:', error)
      throw error
    }
  }

  const approveInstructorContext = async (userId) => {
    console.log('AuthProvider.jsx - approveInstructorContext called for user ID:', userId)
    try {
      // This would typically call an API service function similar to the one we defined earlier
      const response = await fetch(`/api/accounts/approve-instructor/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to approve instructor: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('AuthProvider.jsx - Response from approveInstructor:', data)
      return data
    } catch (error) {
      console.error('AuthProvider.jsx - Error approving instructor:', error)
      throw error
    }
  }

  const logoutContext = async () => {
    // First, check if we've already cleared tokens in this session
    if (!localStorage.getItem('accessToken')) {
      console.log('No access token found, skipping logout API call')
      clearAuthData()
      return { success: true, message: 'Already logged out' }
    }

    console.log('AuthProvider.jsx - logoutContext called')
    // Store tokens before potential removal
    const accessTokenForLogout = localStorage.getItem('accessToken')
    const refreshTokenForLogout = localStorage.getItem('refreshToken')

    try {
      // Clear tokens immediately to prevent multiple API calls with same tokens
      clearAuthData()

      // Call API with previously stored tokens
      const response = await logout(accessTokenForLogout, refreshTokenForLogout)
      console.log('AuthProvider.jsx - Response from logout:', response)
      console.log('AuthProvider.jsx - Logout successful, user and tokens cleared.')
      return { success: true, data: response.data }
    } catch (error) {
      console.log('AuthProvider.jsx - Logout API call failed, but tokens already cleared', error)
      return { success: true, message: 'Logged out but server notification failed' }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loginContext,
        registerStudentContext,
        registerInstructorContext,
        approveInstructorContext,
        logoutContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
