import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const ExerciseCard = ({ exercise }) => {
  if (!exercise) {
    return (
      <Card>
        {' '}
        <CardContent>
          {' '}
          <Typography>Loading Exercise...</Typography>{' '}
        </CardContent>{' '}
      </Card>
    )
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {exercise.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {exercise.description}
        </Typography>
        {/* More exercise details or actions can be added here */}
      </CardContent>
    </Card>
  )
}

export default ExerciseCard
