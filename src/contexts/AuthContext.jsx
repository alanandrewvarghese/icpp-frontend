import { createContext, useState, useEffect } from 'react'
import {
  login,
  registerStudent,
  registerInstructor,
  logout,
  refreshTokenService,
} from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    // Restore user from localStorage if available
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log('AuthContext.jsx - User restored from localStorage:', parsedUser)
      } catch (e) {
        console.error('AuthContext.jsx - Error parsing stored user data:', e)
        localStorage.removeItem('user')
      }
    }

    const refreshAccessToken = async () => {
      console.log(
        'AuthContext.jsx - No access token, but refresh token found. Attempting token refresh.',
      )
      const refreshResponse = await refreshTokenService()
      if (refreshResponse?.access) {
        setToken(refreshResponse.access)

        console.log('AuthContext.jsx - Before localStorage.setItem("accessToken") - Refresh')
        try {
          localStorage.setItem('accessToken', refreshResponse.access)
          console.log(
            'AuthContext.jsx - After localStorage.setItem("accessToken") - Refresh - Success',
          )
        } catch (e) {
          console.error('AuthContext.jsx - Error saving refreshed accessToken to localStorage:', e)
        }

        console.log('AuthContext.jsx - Access token refreshed successfully.')
      } else {
        // If refresh fails, clear any stale data
        clearAuthData()
      }
    }

    if (storedAccessToken) {
      setToken(storedAccessToken)
      console.log('AuthContext.jsx - Access token found in localStorage, persisting login state.')
    } else if (storedRefreshToken) {
      refreshAccessToken()
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
    const response = await login(username, password)
    if (response.access) {
      setUser(response.user)
      setToken(response.access)

      console.log('AuthContext.jsx - Before localStorage.setItem("accessToken")')
      try {
        localStorage.setItem('accessToken', response.access)
        console.log('AuthContext.jsx - After localStorage.setItem("accessToken") - Success')
      } catch (e) {
        console.error('AuthContext.jsx - Error saving accessToken to localStorage:', e)
      }

      console.log('AuthContext.jsx - Before localStorage.setItem("refreshToken")')
      try {
        localStorage.setItem('refreshToken', response.refresh)
        console.log('AuthContext.jsx - After localStorage.setItem("refreshToken") - Success')
      } catch (e) {
        console.error('AuthContext.jsx - Error saving refreshToken to localStorage:', e)
      }

      console.log('AuthContext.jsx - Before localStorage.setItem("user")')
      try {
        localStorage.setItem('user', JSON.stringify(response.user))
        console.log('AuthContext.jsx - After localStorage.setItem("user") - Success')
      } catch (e) {
        console.error('AuthContext.jsx - Error saving user to localStorage:', e)
      }

      console.log('AuthContext.jsx - Login successful, tokens and user data set.')
    } else {
      console.log(
        'AuthContext.jsx - Login failed (no access token in response data). Response:',
        response,
      )
    }
    return response
  }

  // Rest of your existing code...
  const registerStudentContext = async (username, password, email) => {
    console.log('AuthContext.jsx - registerStudentContext called with:', username, email)
    const response = await registerStudent(username, password, email)
    console.log('AuthContext.jsx - Response from registerStudent:', response)
    return response
  }

  const registerInstructorContext = async (username, password, email) => {
    console.log('AuthContext.jsx - registerInstructorContext called with:', username, email)
    const response = await registerInstructor(username, password, email)
    console.log('AuthContext.jsx - Response from registerInstructor:', response)
    return response
  }

  const logoutContext = async () => {
    // First, check if we've already cleared tokens in this session
    if (!localStorage.getItem('accessToken')) {
      console.log('No access token found, skipping logout API call')
      clearAuthData()
      return { success: true, message: 'Already logged out' }
    }

    console.log('AuthContext.jsx - logoutContext called')
    // Store tokens before potential removal
    const accessTokenForLogout = localStorage.getItem('accessToken')
    const refreshTokenForLogout = localStorage.getItem('refreshToken')

    try {
      // Clear tokens immediately to prevent multiple API calls with same tokens
      clearAuthData()

      // Call API with previously stored tokens
      const response = await logout(accessTokenForLogout, refreshTokenForLogout)
      console.log('AuthContext.jsx - Response from logout:', response)
      console.log('AuthContext.jsx - Logout successful, user and tokens cleared.')
      return { success: true, data: response.data }
    } catch (error) {
      console.log('AuthContext.jsx - Logout API call failed, but tokens already cleared', error)
      return { success: true, message: 'Logged out but server notification failed' }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginContext,
        registerStudentContext,
        registerInstructorContext,
        logoutContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
