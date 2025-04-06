// src/components/lessons/lessonDetails/tabs/ExercisesTab.jsx
import React, { useState } from 'react' // Import useState
import { Box, Typography, Paper, Button } from '@mui/material' // Add Button import
import ExerciseList from '../../../exercises/ExerciseList'
import ExerciseDetail from '../../../exercises/ExerciseDetail'
import AuthCheck from '../../../AuthCheck' // Import AuthCheck
import AddIcon from '@mui/icons-material/Add' // Import AddIcon
import { useNavigate } from 'react-router-dom' // Import useNavigate

const ExercisesTab = ({ lesson, theme }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const navigate = useNavigate() // Add navigate hook

  const handleExerciseSelected = (exerciseId) => {
    setSelectedExerciseId(exerciseId)
  }

  const handleBackToList = () => {
    setSelectedExerciseId(null)
  }

  // Add the renderAddExerciseButton function
  const renderAddExerciseButton = () => (
    <AuthCheck allowedRoles={['instructor']}>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/exercises/create')}
        >
          Create New Exercise
        </Button>
      </Box>
    </AuthCheck>
  )

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

      {/* Add button here but only if not viewing a specific exercise */}
      {!selectedExerciseId && renderAddExerciseButton()}

      {selectedExerciseId ? (
        <Box>
          <Button onClick={handleBackToList} sx={{ mb: 2 }}>
            Back to Exercise List
          </Button>
          <ExerciseDetail exerciseId={selectedExerciseId} />
        </Box>
      ) : (
        <ExerciseList lessonId={lesson.id} onExerciseSelect={handleExerciseSelected} />
      )}
    </Paper>
  )
}

export default ExercisesTab
