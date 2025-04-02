import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Divider, CircularProgress, Alert, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import MarginTop from '../../components/layout/MarginTop'
import { fetchExercises } from '../../services/exerciseService'
import AllExercisesList from '../../components/exercises/AllExercisesList'
import AuthCheck from '../../components/AuthCheck'
import { useNavigate } from 'react-router-dom'

const AllExercisesPage = () => {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true)
      try {
        const data = await fetchExercises()
        setExercises(data)
      } catch (err) {
        setError(err.message || 'Failed to load exercises.')
        console.error('Failed to fetch exercises:', err)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  if (loading) {
    return (
      <Container maxWidth="lg">
        <MarginTop mt="64px" />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <MarginTop mt="64px" />
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" className="h-screen">
      <MarginTop mt="64px" />
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 3,
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
            All Exercises
          </Typography>

          {/* <AuthCheck allowedRoles={['instructor', 'admin']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/exercises/create')}
            >
              Create Exercise
            </Button>
          </AuthCheck> */}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {exercises.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No exercises available.
          </Typography>
        ) : (
          <AllExercisesList exercises={exercises} />
        )}
      </Box>
    </Container>
  )
}

export default AllExercisesPage
