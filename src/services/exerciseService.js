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

const createExercise = async (exerciseData) => {
  try {
    const response = await apiClient.post('/lessons/exercises/', exerciseData)
    return response.data
  } catch (error) {
    console.error('Error creating exercise:', error)
    let errorMessage = 'Failed to create exercise'

    if (error.response?.data) {
      // Handle detailed API error responses
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail
      } else {
        // Format field errors
        const fieldErrors = Object.entries(error.response.data)
          .map(
            ([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`,
          )
          .join('; ')

        if (fieldErrors) {
          errorMessage = fieldErrors
        }
      }
    }

    throw new Error(errorMessage)
  }
}

const updateExercise = async (exerciseId, exerciseData) => {
  try {
    const response = await apiClient.put(`/lessons/exercises/${exerciseId}/`, exerciseData)
    return response.data
  } catch (error) {
    console.error(`Error updating exercise with ID ${exerciseId}:`, error)
    let errorMessage = 'Failed to update exercise'

    if (error.response?.data) {
      // Handle detailed API error responses
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail
      } else {
        // Format field errors
        const fieldErrors = Object.entries(error.response.data)
          .map(
            ([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`,
          )
          .join('; ')

        if (fieldErrors) {
          errorMessage = fieldErrors
        }
      }
    }

    throw new Error(errorMessage)
  }
}

const deleteExercise = async (exerciseId) => {
  try {
    const response = await apiClient.delete(`/lessons/exercises/${exerciseId}/`)
    return response.data
  } catch (error) {
    console.error(`Error deleting exercise with ID ${exerciseId}:`, error)
    throw error
  }
}

export {
  fetchExercises,
  fetchExercise,
  fetchLessonExercises,
  createExercise,
  updateExercise,
  deleteExercise,
}
