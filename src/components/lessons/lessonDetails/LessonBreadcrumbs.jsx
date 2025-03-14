import React from 'react'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'
import { Home as HomeIcon, School as SchoolIcon } from '@mui/icons-material'

const LessonBreadcrumbs = ({ lesson }) => {
  return (
    <Breadcrumbs sx={{ mb: 2, pt: 2 }}>
      <Link underline="hover" color="inherit" href="/">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Box>
      </Link>
      <Link underline="hover" color="inherit" href="/lessons">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 0.5 }} fontSize="small" />
          Lessons
        </Box>
      </Link>
      <Typography color="text.primary">{lesson.title}</Typography>
    </Breadcrumbs>
  )
}

export default LessonBreadcrumbs
