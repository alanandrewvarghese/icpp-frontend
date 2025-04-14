import { useState, useEffect, useCallback } from 'react'
import statusService from '../services/statusService'

/**
 * Hook for managing completion status of learning content
 * @param {string} contentType - 'lesson', 'quiz', or 'exercise'
 * @param {number|string} contentId - ID of the content item
 */
const useCompletionStatus = (contentType, contentId) => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch the current status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!contentType || !contentId) return

      try {
        setLoading(true)
        const data = await statusService.getContentStatus(contentType, contentId)
        setStatus(data)
        setError(null)
      } catch (err) {
        console.error(`Error fetching ${contentType} status:`, err)
        setError(err.message || 'Failed to load completion status')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [contentType, contentId])

  // Update the status
  const updateStatus = useCallback(
    async (completed) => {
      if (!contentType || !contentId) return

      try {
        setLoading(true)
        const updatedStatus = await statusService.updateContentStatus(
          contentType,
          contentId,
          completed,
        )
        setStatus(updatedStatus)
        setError(null)
        return updatedStatus
      } catch (err) {
        console.error(`Error updating ${contentType} status:`, err)
        setError(err.message || 'Failed to update completion status')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contentType, contentId],
  )

  // Mark as completed
  const markComplete = useCallback(async () => {
    return updateStatus(true)
  }, [updateStatus])

  // Mark as incomplete
  const markIncomplete = useCallback(async () => {
    return updateStatus(false)
  }, [updateStatus])

  return {
    status,
    loading,
    error,
    isCompleted: status?.completed || false,
    updateStatus,
    markComplete,
    markIncomplete,
  }
}

export default useCompletionStatus
