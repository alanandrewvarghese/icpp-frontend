import React from 'react'
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material'

const ExercisesTab = ({ lesson, theme }) => {
  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No exercises available for this lesson.
      </Typography>
    )
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 500 }}>
        Exercises
      </Typography>
      <List>
        {lesson.exercises.map((exercise, index) => (
          <ListItem key={index} sx={{ mb: 2, p: 0 }}>
            <ListItemText
              primary={`Exercise ${index + 1}: ${exercise.title}`}
              secondary={exercise.description}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default ExercisesTab
