// src/components/lessons/lessonDetails/tabs/ExercisesTab.jsx
import React, { useState } from 'react' // Import useState
import { Box, Typography, Paper } from '@mui/material'
import ExerciseList from '../../../exercises/ExerciseList'
import ExerciseDetail from '../../../exercises/ExerciseDetail' // Import ExerciseDetail

const ExercisesTab = ({ lesson, theme }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState(null) // State to track selected exercise

  const handleExerciseSelected = (exerciseId) => {
    // Function to handle exercise selection
    setSelectedExerciseId(exerciseId)
  }

  const handleBackToList = () => {
    // Function to go back to the list
    setSelectedExerciseId(null)
  }

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

      {selectedExerciseId ? (
        <Box>
          <Button onClick={handleBackToList} sx={{ mb: 2 }}>
            {' '}
            {/* Button to go back to exercise list */}
            Back to Exercise List
          </Button>
          <ExerciseDetail exerciseId={selectedExerciseId} />{' '}
          {/* Render ExerciseDetail for selected exercise */}
        </Box>
      ) : (
        <ExerciseList lessonId={lesson.id} onExerciseSelect={handleExerciseSelected} /> // Render ExerciseList and pass onExerciseSelect
      )}
    </Paper>
  )
}

export default ExercisesTab
