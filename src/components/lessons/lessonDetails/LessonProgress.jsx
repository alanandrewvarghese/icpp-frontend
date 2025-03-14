import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'

const LessonProgress = ({ value = 25 }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Progress
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {value}%
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={value} sx={{ height: 6, borderRadius: 3 }} />
    </Box>
  )
}

export default LessonProgress
