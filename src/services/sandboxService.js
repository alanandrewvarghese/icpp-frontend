import apiClient from './apiClient'

const sandboxService = {
  executeCode: async (code, exerciseId, stdin = '') => {
    try {
      const response = await apiClient.post('sandbox/execution-requests/', {
        code,
        exercise: exerciseId,
        stdin,
      })
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Error executing code'
      throw new Error(errorMessage)
    }
  },

  getExecutionStatus: async (executionId) => {
    try {
      const response = await apiClient.get(`sandbox/execution-results/${executionId}/`)
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Error fetching execution status'
      throw new Error(errorMessage)
    }
  },

  pollExecutionResults: async (executionId, interval = 1000, timeout = 30000) => {
    const startTime = Date.now()

    const checkStatus = async () => {
      const result = await sandboxService.getExecutionStatus(executionId)

      if (result) {
        return result
      }

      if (Date.now() - startTime > timeout) {
        throw new Error('Execution timed out')
      }

      await new Promise((resolve) => setTimeout(resolve, interval))
      return checkStatus()
    }

    return checkStatus()
  },

  submitSolution: async (exerciseId, code) => {
    try {
      const response = await apiClient.post(`progress/exercises/${exerciseId}/submit/`, {
        exercise: exerciseId,
        submitted_code: code,
      })
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || 'Error submitting solution'
      throw new Error(errorMessage)
    }
  },
}

export default sandboxService
