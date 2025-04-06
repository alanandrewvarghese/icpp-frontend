import apiClient from './apiClient'

/**
 * Service for fetching analytics data from the API
 */
const analyticsService = {
  /**
   * Fetch lesson analytics data
   * @param {Object} params - Optional query parameters (e.g., date range)
   * @returns {Promise} - Promise resolving to lesson analytics data
   */
  getLessonAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/lessons/', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching lesson analytics:', error)
      throw error
    }
  },

  /**
   * Fetch exercise analytics data
   * @param {Object} params - Optional query parameters (e.g., date range)
   * @returns {Promise} - Promise resolving to exercise analytics data
   */
  getExerciseAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/exercises/', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching exercise analytics:', error)
      throw error
    }
  },

  /**
   * Fetch sandbox analytics data
   * @param {Object} params - Optional query parameters (e.g., date range)
   * @returns {Promise} - Promise resolving to sandbox analytics data
   */
  getSandboxAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/sandbox/', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching sandbox analytics:', error)
      throw error
    }
  },
}

export default analyticsService
