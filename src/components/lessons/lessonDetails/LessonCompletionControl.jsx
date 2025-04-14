import React, { useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import useCompletionStatus from '../../../hooks/useCompletionStatus'

/**
 * Component for displaying and controlling the completion status of a lesson
 */
const LessonCompletionControl = ({ lessonId }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const { status, loading, error, isCompleted, markComplete, markIncomplete } = useCompletionStatus(
    'lesson',
    lessonId,
  )

  const handleToggleCompletion = async () => {
    try {
      setIsUpdating(true)
      if (isCompleted) {
        await markIncomplete()
      } else {
        await markComplete()
      }
    } catch (err) {
      console.error('Failed to update lesson completion status:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2">Loading status...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Error loading completion status
      </Typography>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <Button
        variant={isCompleted ? 'outlined' : 'contained'}
        color={isCompleted ? 'success' : 'primary'}
        startIcon={isCompleted ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
        onClick={handleToggleCompletion}
        disabled={isUpdating}
        sx={{ borderRadius: 4 }}
      >
        {isUpdating ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
        {isCompleted ? 'Marked Complete' : 'Mark as Complete'}
      </Button>
    </Box>
  )
}

export default LessonCompletionControl
