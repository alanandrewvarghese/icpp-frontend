import apiClient from './apiClient'

const BASE_URL = '/status'

/**
 * Service to interact with the Status API for tracking completion status
 * of various learning content (lessons, quizzes, exercises)
 */
const statusService = {
  /**
   * Get all completion statuses for the current user
   */
  getAllStatuses: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/statuses/`)
      return response.data
    } catch (error) {
      console.error('Error fetching all statuses:', error)
      throw error
    }
  },

  /**
   * Get all lesson completion statuses for the current user
   */
  getLessonStatuses: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/statuses/lessons/`)
      return response.data
    } catch (error) {
      console.error('Error fetching lesson statuses:', error)
      throw error
    }
  },

  /**
   * Get all quiz completion statuses for the current user
   */
  getQuizStatuses: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/statuses/quizzes/`)
      return response.data
    } catch (error) {
      console.error('Error fetching quiz statuses:', error)
      throw error
    }
  },

  /**
   * Get all exercise completion statuses for the current user
   */
  getExerciseStatuses: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/statuses/exercises/`)
      return response.data
    } catch (error) {
      console.error('Error fetching exercise statuses:', error)
      throw error
    }
  },

  /**
   * Get status for a specific content item
   * @param {string} contentType - 'lesson', 'quiz', or 'exercise'
   * @param {number|string} contentId - ID of the content item
   */
  getContentStatus: async (contentType, contentId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${contentType}/${contentId}/`)
      return response.data
    } catch (error) {
      console.error(`Error fetching status for ${contentType} ${contentId}:`, error)
      throw error
    }
  },

  /**
   * Update status for a specific content item
   * @param {string} contentType - 'lesson', 'quiz', or 'exercise'
   * @param {number|string} contentId - ID of the content item
   * @param {boolean} completed - Whether the content is completed or not
   */
  updateContentStatus: async (contentType, contentId, completed) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${contentType}/${contentId}/`, {
        completed,
      })
      return response.data
    } catch (error) {
      console.error(`Error updating status for ${contentType} ${contentId}:`, error)
      throw error
    }
  },
}

export default statusService
