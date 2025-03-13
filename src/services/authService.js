import axios from 'axios'
import apiClient from './apiClient'

export const login = async (username, password) => {
  console.log('authService.js - login function called with:', username, password)
  try {
    // Use regular axios for login since we don't have a token yet
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}accounts/auth/login/`, {
      username,
      password,
    })
    console.log('authService.js - Full login service response:', response)
    return response.data
  } catch (error) {
    console.error('authService.js - Error during login:', error)
    return error.response?.data
  }
}

export const refreshTokenService = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/auth/token/refresh/`,
      {
        refresh: refreshToken,
      },
    )
    console.log('authService.js - Token refresh service response:', response)
    return response.data
  } catch (error) {
    console.error('authService.js - Error during token refresh:', error)
    return null
  }
}

export const registerStudent = async (username, password, email) => {
  try {
    // Use regular axios for registration since we don't have a token yet
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/register/student/`,
      {
        username,
        password,
        email,
      },
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const registerInstructor = async (username, password, email) => {
  try {
    // Use regular axios for registration since we don't have a token yet
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/register/instructor/`,
      {
        username,
        password,
        email,
      },
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const logout = async () => {
  console.log('authService.js - logout function called')
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    console.warn('authService.js - No valid refresh token found, clearing storage.')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return { success: false, message: 'No valid tokens found.' }
  }

  try {
    // Use apiClient which automatically adds the token
    const response = await apiClient.post('accounts/auth/logout/', {
      refresh: refreshToken,
    })

    console.log('authService.js - Logout service response:', response.data)

    // Clear tokens after successful logout
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    return { success: true, data: response.data }
  } catch (error) {
    console.error('authService.js - Error during logout:', error)

    // Ensure tokens are cleared even if logout fails
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    return {
      success: false,
      message: error.response?.data || 'Logout failed due to an unknown error.',
    }
  }
}

export const changePasswordService = async (currentPassword, newPassword) => {
  try {
    // Notice we don't need to manually add the token here anymore
    const response = await apiClient.post('accounts/auth/password/change/', {
      oldpassword: currentPassword,
      newpassword: newPassword,
      confirmnewpassword: newPassword,
    })
    return { success: true, data: response.data }
  } catch (error) {
    console.error('authService.js - Error during password change:', error)
    let errorMessage = 'Failed to change password.'
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage = error.response.data.detail // Get detailed error from backend
    } else if (error.message) {
      errorMessage = error.message // Get error message from axios or network error
    }
    return { success: false, error: errorMessage }
  }
}

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/auth/password/reset/`,
      { email },
    )
    return { success: true, data: response.data }
  } catch (error) {
    console.error('authService.js - Error requesting password reset:', error)
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to send password reset email.',
    }
  }
}

export const confirmPasswordReset = async (uidb64, token, newPassword, confirmNewPassword) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/auth/password/reset/confirm/${uidb64}/${token}/`,
      { new_password: newPassword, confirm_new_password: confirmNewPassword },
    )
    return { success: true, data: response.data }
  } catch (error) {
    console.error('authService.js - Error confirming password reset:', error)
    return {
      success: false,
      error:
        error.response?.data?.error || 'Password reset failed. Please ensure the link is valid.',
    }
  }
}
