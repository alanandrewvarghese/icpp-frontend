import apiClient from './apiClient'

const fetchExercises = async () => {
  try {
    const response = await apiClient.get('/lessons/exercises/') // Backend endpoint for listing exercises
    return response.data
  } catch (error) {
    console.error('Error fetching exercises:', error)
    throw error // Re-throw to handle error in component
  }
}

const fetchExercise = async (exerciseId) => {
  try {
    const response = await apiClient.get(`/lessons/exercises/${exerciseId}/`) // Endpoint to get a specific exercise
    return response.data
  } catch (error) {
    console.error(`Error fetching exercise with ID ${exerciseId}:`, error)
    throw error
  }
}

const fetchLessonExercises = async (lessonId) => {
  try {
    const response = await apiClient.get(`/lessons/${lessonId}/exercises/`) // Backend endpoint for lesson-specific exercises
    return response.data
  } catch (error) {
    console.error(`Error fetching exercises for lesson ${lessonId}:`, error)
    throw error
  }
}

export { fetchExercises, fetchExercise, fetchLessonExercises }
