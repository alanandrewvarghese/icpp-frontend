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

const createLesson = async (lessonData) => {
  try {
    const response = await apiClient.post('/lessons/lessons/', lessonData) // POST to lessons endpoint
    return response.data
  } catch (error) {
    console.error('Error creating lesson:', error)
    return { error: error.response?.data || 'Failed to create lesson' }
  }
}

const getMaxLessonOrder = async () => {
  try {
    const response = await apiClient.get('/lessons/max-order/')
    return response.data.max_order || 0
  } catch (error) {
    console.error('Error fetching max lesson order:', error)
    return 0
  }
}

const updateLesson = async (lessonId, lessonData) => {
  try {
    console.log(lessonId, lessonData)
    const response = await apiClient.put(`/lessons/lessons/${lessonId}/`, lessonData) // PUT to update lesson
    return response.data
  } catch (error) {
    console.error(`Error updating lesson with ID ${lessonId}:`, error)
    throw error
  }
}

export { fetchLessons, fetchLesson, createLesson, getMaxLessonOrder, updateLesson }
