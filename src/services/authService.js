import axios from 'axios'

export const login = async (username, password) => {
  console.log('authService.js - login function called with:', username, password)
  try {
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

export const logout = async (accessToken, refreshToken) => {
  console.log('authService.js - logout function called with:', { refreshToken, accessToken })

  if (!refreshToken || !accessToken) {
    console.warn('authService.js - No valid tokens found, clearing storage.')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return { success: false, message: 'No valid tokens found.' }
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}accounts/auth/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    )

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
