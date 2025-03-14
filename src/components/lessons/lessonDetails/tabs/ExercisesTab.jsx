import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import ExerciseList from '../../../exercises/ExerciseList'

const ExercisesTab = ({ lesson, theme }) => {
  if (!lesson || !lesson.id) {
    return (
      <Typography variant="body1" color="text.secondary">
        No exercises available for this lesson.
      </Typography>
    )
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 1 }} elevation={0} variant="outlined">
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 500 }}>
        Exercises
      </Typography>
      {/* Pass the lesson ID to ExerciseList */}
      <ExerciseList lessonId={lesson.id} />
    </Paper>
  )
}

export default ExercisesTab
