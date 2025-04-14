import React from 'react'
import { Box, Chip, Tooltip, CircularProgress } from '@mui/material'
import { CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material'
import useCompletionStatus from '../../hooks/useCompletionStatus'

/**
 * Component to display and manage the completion status of a content item
 */
const CompletionStatus = ({
  contentType,
  contentId,
  onStatusChange,
  showToggle = false,
  size = 'medium',
}) => {
  const { status, loading, error, isCompleted, markComplete, markIncomplete } = useCompletionStatus(
    contentType,
    contentId,
  )

  if (loading) {
    return <CircularProgress size={24} />
  }

  if (error) {
    return (
      <Tooltip title={`Error: ${error}`}>
        <Chip
          icon={<Cancel color="error" />}
          label="Error"
          size={size}
          color="error"
          variant="outlined"
        />
      </Tooltip>
    )
  }

  const toggleStatus = async () => {
    try {
      const newStatus = isCompleted ? await markIncomplete() : await markComplete()
      if (onStatusChange) {
        onStatusChange(newStatus)
      }
    } catch (err) {
      console.error('Error toggling status:', err)
    }
  }

  return (
    <Tooltip
      title={
        isCompleted
          ? `Completed ${status?.completed_at ? `on ${new Date(status.completed_at).toLocaleDateString()}` : ''}`
          : 'Not completed yet'
      }
    >
      <Chip
        icon={isCompleted ? <CheckCircle color="success" /> : <HourglassEmpty color="action" />}
        label={isCompleted ? 'Completed' : 'Incomplete'}
        color={isCompleted ? 'success' : 'default'}
        variant={isCompleted ? 'filled' : 'outlined'}
        size={size}
        onClick={showToggle ? toggleStatus : undefined}
        clickable={showToggle}
      />
    </Tooltip>
  )
}

export default CompletionStatus
