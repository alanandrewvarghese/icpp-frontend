import React, { useState, useEffect } from 'react'
import { fetchLessonExercises } from '../../services/exerciseService'
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  Button,
} from '@mui/material'
import { Code as CodeIcon, KeyboardArrowRight as ArrowIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toTitleCase from '../../utils/toTitleCase'
import CompletionStatus from '../common/CompletionStatus'

const ExerciseList = ({ lessonId, onExerciseSelect }) => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()
  const navigate = useNavigate()

  const loadExercises = async (lessonId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLessonExercises(lessonId)
      setExercises(data || [])
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while loading exercises.')
      console.error('Failed to fetch exercises:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lessonId) {
      loadExercises(lessonId)
    }
  }, [lessonId])

  const handleExerciseClick = (exerciseId) => {
    // FIX: Check if we're inside a tab view or standalone
    if (onExerciseSelect) {
      // We're in a tab view, use the provided callback
      onExerciseSelect(exerciseId)
    } else {
      // We're standalone, navigate directly
      navigate(`/exercises/${exerciseId}`)
    }
  }

  if (!lessonId) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="body1">
          No lesson selected. Please select a lesson to view exercises.
        </Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!Array.isArray(exercises) || exercises.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="body1">No exercises available for this lesson.</Typography>
      </Box>
    )
  }

  return (
    <>
      <List sx={{ width: '100%' }}>
        {exercises.map((exercise, index) => (
          <React.Fragment key={exercise.id}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 1,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <ListItem
                alignItems="flex-start"
                sx={{ px: 1.5, py: 0.5 }}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CompletionStatus contentType="exercise" contentId={exercise.id} size="small" />
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowIcon />}
                      onClick={() => {
                        navigate(`/exercises/${exercise.id}`)
                      }}
                    >
                      Start
                    </Button>
                  </Box>
                }
              >
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mr: 2,
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    <CodeIcon color="primary" />
                  </Box>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                        {exercise.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Author: {toTitleCase(exercise.author_name)}
                      </Typography>
                    }
                  />
                </Box>
              </ListItem>
            </Paper>
            {index < exercises.length - 1 && <Box sx={{ mb: 2 }} />}
          </React.Fragment>
        ))}
      </List>
    </>
  )
}

export default ExerciseList
