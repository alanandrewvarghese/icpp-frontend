import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LessonForm from '../../components/lessons/LessonForm'
import ContentPreview from '../../components/lessons/ContentPreview'
import Container from '@mui/material/Container'
import MarginTop from '../../components/layout/MarginTop'
import AuthCheck from '../../components/AuthCheck'
import { Typography, Grid } from '@mui/material'
import { fetchLesson, createLesson, updateLesson } from '../../services/lessonService'

const CreateLessonPage = () => {
  const { lessonId } = useParams() // Get lessonId from the route
  const navigate = useNavigate()
  const [lessonContent, setLessonContent] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDescription, setLessonDescription] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (lessonId) {
      setIsEditMode(true)
      // Fetch the lesson data for editing
      const loadLesson = async () => {
        try {
          const lesson = await fetchLesson(lessonId)
          setLessonTitle(lesson.title)
          setLessonDescription(lesson.description || '')
          setLessonContent(lesson.content)
        } catch (error) {
          console.error('Failed to fetch lesson:', error)
        }
      }
      loadLesson()
    }
  }, [lessonId])

  const handleContentChange = (content) => {
    setLessonContent(content)
  }

  const handleTitleChange = (title) => {
    setLessonTitle(title)
  }

  const handleDescriptionChange = (description) => {
    setLessonDescription(description)
  }

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        // Update the existing lesson
        await updateLesson(lessonId, {
          title: formData.title,
          description: formData.description,
          content: formData.content,
        })
        // alert('Lesson updated successfully!')
      } else {
        // Create a new lesson
        await createLesson(formData)
        // alert('Lesson created successfully!')
      }
      navigate('/lessons') // Redirect to the lesson list page
    } catch (error) {
      console.error('Failed to save lesson:', error)
      alert('An error occurred while saving the lesson.')
      throw error // Re-throw to let the form component handle the error state
    }
  }

  return (
    <AuthCheck allowedRoles={['admin', 'instructor']}>
      <Container maxWidth="xl" sx={{ mb: 6, height: '100%' }}>
        <MarginTop mt="100px" />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Left column: Form */}
            <LessonForm
              onContentChange={handleContentChange}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              onSubmit={handleSubmit}
              initialTitle={lessonTitle}
              initialContent={lessonContent}
              initialDescription={lessonDescription}
              isEditMode={isEditMode}
            />
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
