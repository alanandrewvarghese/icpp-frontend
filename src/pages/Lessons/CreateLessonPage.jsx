import React, { useState } from 'react'
import LessonForm from '../../components/lessons/LessonForm'
import ContentPreview from '../../components/lessons/ContentPreview'
import Container from '@mui/material/Container'
import MarginTop from '../../components/layout/MarginTop'
import AuthCheck from '../../components/AuthCheck'
import { Typography, Grid, Paper } from '@mui/material'

const CreateLessonPage = () => {
  const [lessonContent, setLessonContent] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')

  const handleContentChange = (content) => {
    setLessonContent(content)
  }

  const handleTitleChange = (title) => {
    setLessonTitle(title)
  }

  return (
    <AuthCheck allowedRoles={['admin', 'instructor']}>
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <MarginTop mt="72px" />
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Lesson
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Left column: Form */}
            <LessonForm onContentChange={handleContentChange} onTitleChange={handleTitleChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Right column: Preview */}
            <ContentPreview content={lessonContent} title={lessonTitle} />
          </Grid>
        </Grid>
      </Container>
    </AuthCheck>
  )
}

export default CreateLessonPage
