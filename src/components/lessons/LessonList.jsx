import React, { useState, useEffect } from 'react'
import { fetchLessons } from '../../services/lessonService'
import LessonCard from './LessonCard'
import { CircularProgress, Alert, Grid, Box, Typography, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AuthCheck from '../AuthCheck'
import { useNavigate } from 'react-router-dom'

const LessonList = () => {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true)
      setError(null) // Clear any previous errors
      try {
        const data = await fetchLessons()

        // Sort lessons by the order property if it exists
        const sortedLessons = [...(data || [])].sort((a, b) => {
          // If order property exists, use it for sorting
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order
          }

          // Fallback to sorting by creation date or ID if no order exists
          return new Date(a.created_at) - new Date(b.created_at)
        })

        setLessons(sortedLessons)
      } catch (err) {
        setError(err.message || 'Failed to load lessons.')
        console.error('Failed to fetch lessons:', err)
      } finally {
        setLoading(false)
      }
    }

    loadLessons()
  }, [])

  const handleEditLesson = (lessonId) => {
    navigate(`/lessons/edit/${lessonId}`) // Navigate to CreateLessonPage in edit mode
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

  if (!Array.isArray(lessons) || lessons.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="body1">No lessons available at the moment.</Typography>
      </Box>
    )
  }

  return (
    <div>
      <Grid container spacing={3}>
        {lessons.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} key={lesson.id}>
            <Box position="relative">
              <LessonCard lesson={lesson} />
              {/* Only show the Edit button to instructors and admins */}
              <AuthCheck allowedRoles={['admin', 'instructor']}>
                <IconButton
                  onClick={() => handleEditLesson(lesson.id)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </AuthCheck>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default LessonList
