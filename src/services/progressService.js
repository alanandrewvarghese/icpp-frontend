import apiClient from './apiClient'

/**
 * Fetch the progress for a specific lesson
 * @param {number|string} lessonId - The ID of the lesson to get progress for
 * @returns {Promise} - Promise with the lesson progress data
 */
const fetchLessonProgress = async (lessonId) => {
  try {
    const response = await apiClient.get(`/progress/lessons/${lessonId}/progress/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching progress for lesson ID ${lessonId}:`, error)
    throw error
  }
}

const fetchUserProgress = async () => {
  try {
    const response = await apiClient.get('/progress/user/')
    return response.data
  } catch (error) {
    console.error('Error fetching user progress:', error)
    throw error
  }
}

const getUserBadges = async () => {
  try {
    const response = await apiClient.get('/badges/users/me/badges/')
    return response.data
  } catch (error) {
    console.error('Error fetching user badges:', error)
    throw error
  }
}

export { fetchLessonProgress, fetchUserProgress, getUserBadges }
