import apiClient from './apiClient'

const BASE_URL = '/quiz'

/**
 * Service that handles all quiz-related API operations
 */
const quizService = {
  /**
   * Quiz Management Operations
   */

  // Get all quizzes (admins see all, instructors see their own)
  getAllQuizzes: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/quizzes/`)
      return response.data
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      throw error
    }
  },

  // Get a single quiz by ID
  getQuiz: async (quizId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/quizzes/${quizId}/`)
      return response.data
    } catch (error) {
      console.error(`Error fetching quiz ${quizId}:`, error)
      throw error
    }
  },

  // Create a new quiz
  createQuiz: async (quizData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/quizzes/`, quizData)
      return response.data
    } catch (error) {
      console.error('Error creating quiz:', error)
      throw error
    }
  },

  // Update an existing quiz
  updateQuiz: async (quizId, quizData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/quizzes/${quizId}/`, quizData)
      return response.data
    } catch (error) {
      console.error(`Error updating quiz ${quizId}:`, error)
      throw error
    }
  },

  // Partially update a quiz
  partialUpdateQuiz: async (quizId, quizData) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/quizzes/${quizId}/`, quizData)
      return response.data
    } catch (error) {
      console.error(`Error partially updating quiz ${quizId}:`, error)
      throw error
    }
  },

  // Delete a quiz
  deleteQuiz: async (quizId) => {
    try {
      await apiClient.delete(`${BASE_URL}/quizzes/${quizId}/`)
      return true
    } catch (error) {
      console.error(`Error deleting quiz ${quizId}:`, error)
      throw error
    }
  },

  // Create a quiz for a specific lesson
  createQuizForLesson: async (lessonId, quizData) => {
    try {
      // The correct endpoint based on the API documentation and error
      const response = await apiClient.post(`${BASE_URL}/quizzes/`, {
        ...quizData,
        lesson_id: lessonId,
      })
      return response.data
    } catch (error) {
      console.error(`Error creating quiz for lesson ${lessonId}:`, error)
      throw error
    }
  },

  // Get quiz for a specific lesson
  getQuizForLesson: async (lessonId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/lesson/${lessonId}/quiz/`)
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error(`Error fetching quiz for lesson ${lessonId}:`, error)
      throw error
    }
  },

  /**
   * Question Management Operations
   */

  // Get all questions (optionally filtered by quiz)
  getQuestions: async (quizId = null) => {
    try {
      const url = quizId ? `${BASE_URL}/questions/?quiz_id=${quizId}` : `${BASE_URL}/questions/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching questions:', error)
      throw error
    }
  },

  // Create a new question
  createQuestion: async (questionData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/questions/`, questionData)
      return response.data
    } catch (error) {
      console.error('Error creating question:', error)
      throw error
    }
  },

  // Update an existing question
  updateQuestion: async (questionId, questionData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/questions/${questionId}/`, questionData)
      return response.data
    } catch (error) {
      console.error(`Error updating question ${questionId}:`, error)
      throw error
    }
  },

  // Delete a question
  deleteQuestion: async (questionId) => {
    try {
      await apiClient.delete(`${BASE_URL}/questions/${questionId}/`)
      return true
    } catch (error) {
      console.error(`Error deleting question ${questionId}:`, error)
      throw error
    }
  },

  /**
   * Choice Management Operations
   */

  // Get all choices (optionally filtered by question)
  getChoices: async (questionId = null) => {
    try {
      const url = questionId
        ? `${BASE_URL}/choices/?question_id=${questionId}`
        : `${BASE_URL}/choices/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching choices:', error)
      throw error
    }
  },

  // Create a new choice
  createChoice: async (choiceData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/choices/`, choiceData)
      return response.data
    } catch (error) {
      console.error('Error creating choice:', error)
      throw error
    }
  },

  // Update an existing choice
  updateChoice: async (choiceId, choiceData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/choices/${choiceId}/`, choiceData)
      return response.data
    } catch (error) {
      console.error(`Error updating choice ${choiceId}:`, error)
      throw error
    }
  },

  // Delete a choice
  deleteChoice: async (choiceId) => {
    try {
      await apiClient.delete(`${BASE_URL}/choices/${choiceId}/`)
      return true
    } catch (error) {
      console.error(`Error deleting choice ${choiceId}:`, error)
      throw error
    }
  },

  /**
   * Quiz Taking Operations
   */

  // Submit a completed quiz
  submitQuiz: async (quizId, answers) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/submit/`, {
        quiz_id: quizId,
        answers,
      })
      return response.data
    } catch (error) {
      console.error('Error submitting quiz:', error)
      throw error
    }
  },

  /**
   * Bulk Operations
   */

  // Bulk update quiz questions and choices
  bulkUpdateQuiz: async (quizId, quizData) => {
    try {
      console.log('Sending bulk update for quiz', quizId, 'with data:', quizData)
      // Use the quiz management endpoint for bulk updates
      const response = await apiClient.put(`${BASE_URL}/quiz_management/${quizId}/`, quizData)
      return response.data
    } catch (error) {
      console.error(`Error bulk updating quiz ${quizId}:`, error)
      console.error('Response data:', error.response?.data)
      throw error
    }
  },

  /**
   * Quiz Statistics Operations
   */

  // Get statistics for a specific quiz
  getQuizStats: async (quizId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/quizzes/${quizId}/stats/`)
      return response.data
    } catch (error) {
      console.error(`Error fetching statistics for quiz ${quizId}:`, error)
      throw error
    }
  },
}

export default quizService
