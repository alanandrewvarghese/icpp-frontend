import apiClient from './apiClient'

const fetchLessons = async () => {
  try {
    const response = await apiClient.get('/lessons/lessons/') // Backend endpoint for listing lessons
    return response.data
  } catch (error) {
    console.error('Error fetching lessons:', error)
    throw error // Re-throw to handle error in component
  }
}

const fetchLesson = async (lessonId) => {
  try {
    const response = await apiClient.get(`/lessons/lessons/${lessonId}/`) // Endpoint to get a specific lesson
    return response.data
  } catch (error) {
    console.error(`Error fetching lesson with ID ${lessonId}:`, error)
    throw error
  }
}

export { fetchLessons, fetchLesson }
