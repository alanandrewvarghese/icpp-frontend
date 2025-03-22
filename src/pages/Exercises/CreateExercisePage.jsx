import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import MarginTop from '../../components/layout/MarginTop'
import ExerciseForm from '../../components/exercises/ExerciseForm'
import AuthCheck from '../../components/AuthCheck'

const CreateExercisePage = () => {
  return (
    <AuthCheck allowedRoles={['admin', 'instructor']}>
      <Container maxWidth="lg">
        <MarginTop mt="90px" />
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Exercise
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create a new programming exercise for students to solve. Add a clear problem statement,
            starter code, and test cases to verify student solutions.
          </Typography>
        </Box>
        <ExerciseForm />
      </Container>
    </AuthCheck>
  )
}

export default CreateExercisePage
