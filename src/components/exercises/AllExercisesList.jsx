import React from 'react'
import { Box, Typography, Paper, Grid, Chip, Button, Divider, useTheme } from '@mui/material'
import {
  Code as CodeIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  KeyboardArrowRight as ArrowIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toTitleCase from '../../utils/toTitleCase'
import AuthCheck from '../AuthCheck'

const AllExercisesList = ({ exercises }) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercises/${exerciseId}`)
  }

  const handleLessonClick = (lessonId) => {
    navigate(`/lessons/${lessonId}`)
  }

  return (
    <Grid container spacing={3}>
      {exercises.map((exercise) => (
        <Grid item xs={12} key={exercise.id}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                boxShadow: 2,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CodeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    {exercise.title}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {exercise.description.length > 150
                      ? `${exercise.description.substring(0, 150)}...`
                      : exercise.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    icon={<SchoolIcon fontSize="small" />}
                    label={exercise.lesson_title || 'Unknown Lesson'}
                    size="small"
                    onClick={() => handleLessonClick(exercise.lesson)}
                    clickable
                  />
                  <Chip
                    icon={<PersonIcon fontSize="small" />}
                    label={toTitleCase(exercise.author_name) || 'Unknown Author'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowIcon />}
                  onClick={() => handleExerciseClick(exercise.id)}
                >
                  Try Exercise
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default AllExercisesList
