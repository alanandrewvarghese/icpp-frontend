import axios from 'axios'

// Create a custom axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track if we're currently refreshing to prevent infinite loops
let isRefreshing = false
let failedQueue = []

// Process failed requests queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor - add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is due to an invalid token (401) and we aren't already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loops - only try refreshing once per request
      originalRequest._retry = true

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        console.log('apiClient - Token refresh in progress, queuing request')
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      // Start refreshing
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        console.log('apiClient - Attempting token refresh')

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}accounts/auth/token/refresh/`,
          { refresh: refreshToken },
        )

        if (response.data.access) {
          // Store the new access token
          const newToken = response.data.access
          localStorage.setItem('accessToken', newToken)

          console.log('apiClient - Token refreshed successfully, retrying request')

          // Update auth header for the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`

          // Process any queued requests
          processQueue(null, newToken)

          // Retry the original request
          return apiClient(originalRequest)
        } else {
          throw new Error('Refresh token request did not return a new access token')
        }
      } catch (refreshError) {
        console.error('apiClient - Token refresh failed:', refreshError)

        // Handle refresh failure - usually means the user needs to log in again
        processQueue(refreshError, null)

        // Clear auth data
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        // Redirect to login page if refresh fails
        // You might want to handle this via a context or state management instead
        window.location.href = '/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error)
  },
)

export default apiClient
