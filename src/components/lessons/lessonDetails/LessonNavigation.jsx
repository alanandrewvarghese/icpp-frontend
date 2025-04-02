import React from 'react'
import { Box, Button } from '@mui/material'
import { ArrowBack as BackIcon, ArrowForward as NextIcon } from '@mui/icons-material'

const LessonNavigation = ({ handleBack, handleNext }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
      <Button variant="outlined" startIcon={<BackIcon />} onClick={handleBack}>
        Back to Lessons
      </Button>
      {/* <Button variant="contained" endIcon={<NextIcon />} onClick={handleNext}>
        Next Lesson
      </Button> */}
    </Box>
  )
}

export default LessonNavigation
