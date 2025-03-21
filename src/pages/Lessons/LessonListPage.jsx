import React from 'react'
import LessonList from '../../components/lessons/LessonList'
import MarginTop from '../../components/layout/MarginTop'
import { Container, Typography, Box, Divider } from '@mui/material'
import AuthCheck from '../../components/AuthCheck'

const LessonListPage = () => {
  return (
    <Container maxWidth="md" className="h-screen">
      <MarginTop mt="64px" />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ pt: 3, mb: 3, fontWeight: 500 }}>
          Available Lessons
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {/* Pass role-based visibility logic to LessonList */}
        <LessonList />
      </Box>
    </Container>
  )
}

export default LessonListPage
