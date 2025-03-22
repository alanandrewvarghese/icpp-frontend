import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material'
import { useParams } from 'react-router-dom'
import MarginTop from '../../components/layout/MarginTop'
import ExerciseForm from '../../components/exercises/ExerciseForm'
import AuthCheck from '../../components/AuthCheck'
import { fetchExercise } from '../../services/exerciseService'

const EditExercisePage = () => {
  const { exerciseId } = useParams()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadExercise = async () => {
      if (!exerciseId) {
        setError('No exercise ID provided')
        setLoading(false)
        return
      }

      try {
        const data = await fetchExercise(exerciseId)
        console.log('Exercise data received:', data)
        setExercise(data)
      } catch (err) {
        console.error('Failed to fetch exercise details:', err)
        setError('Failed to load exercise. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadExercise()
  }, [exerciseId])

  if (loading) {
    return (
      <Container maxWidth="lg">
        <MarginTop mt="90px" />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !exercise) {
    return (
      <Container maxWidth="lg">
        <MarginTop mt="90px" />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Exercise not found'}
        </Alert>
      </Container>
    )
  }

  return (
    <AuthCheck
      allowedRoles={['admin', 'instructor']}
      createdBy={exercise.author_name}
      fallback={
        <Container maxWidth="lg">
          <MarginTop mt="90px" />
          <Alert severity="error">You don't have permission to edit this exercise.</Alert>
        </Container>
      }
    >
      <Container maxWidth="lg">
        <MarginTop mt="90px" />
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Exercise
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Update this exercise's details, problem statement, starter code, or test cases.
          </Typography>
        </Box>
        {/* Key change: Pass loadingExercise={false} to prevent form loading state */}
        <ExerciseForm isEditMode={true} initialExerciseData={exercise} loadingExercise={false} />
      </Container>
    </AuthCheck>
  )
}

export default EditExercisePage
