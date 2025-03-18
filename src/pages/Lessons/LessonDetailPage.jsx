// src/pages/Lessons/LessonDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchLesson } from '../../services/lessonService'
import {
  Container,
  Box,
  Tabs,
  Tab,
  useTheme,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material'
import { Book as ReadIcon, Code as CodeIcon, Quiz as QuizIcon } from '@mui/icons-material'

// Import your components
import TabPanel from '../../components/lessons/lessonDetails/TabPanel'
import ContentTab from '../../components/lessons/lessonDetails/tabs/ContentTab'
import ExercisesTab from '../../components/lessons/lessonDetails/tabs/ExercisesTab'
import LessonHeader from '../../components/lessons/lessonDetails/LessonHeader'
import LessonBreadcrumbs from '../../components/lessons/lessonDetails/LessonBreadcrumbs'
import LessonNavigation from '../../components/lessons/lessonDetails/LessonNavigation'
import LessonProgress from '../../components/lessons/lessonDetails/LessonProgress'
import MarginTop from '../../components/layout/MarginTop'

// Import markdown utils
import {
  getMarkdownStyles,
  markdownComponents,
  processMarkdownContent,
} from '../../utils/markdownUtils'

const LessonDetailPage = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()

  // Get markdown styles using the theme
  const markdownStyles = getMarkdownStyles(theme)

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const getLesson = async () => {
      try {
        setLoading(true)
        const data = await fetchLesson(lessonId)
        setLesson(data)
        // You might want to check if lesson is bookmarked from API or localStorage
        setBookmarked(localStorage.getItem(`bookmark_${lessonId}`) === 'true')
      } catch (err) {
        console.error('Error fetching lesson:', err)
        setError('Failed to load lesson. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (lessonId) {
      getLesson()
    }
  }, [lessonId])

  useEffect(() => {
    // Check if there's a tab query parameter
    const queryParams = new URLSearchParams(window.location.search)
    const tab = queryParams.get('tab')

    // If tab parameter is 'exercises', set the tab value to 1 (Exercises tab)
    if (tab === 'exercises') {
      setTabValue(1)
    }
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleBookmark = () => {
    const newBookmarkState = !bookmarked
    setBookmarked(newBookmarkState)
    localStorage.setItem(`bookmark_${lessonId}`, newBookmarkState)
  }

  const handleBack = () => {
    navigate(-1) // Navigate back in history
  }

  const handleNext = () => {
    const nextLessonId = parseInt(lessonId, 10) + 1 // Increment the current lesson ID
    navigate(`/lessons/${nextLessonId}`) // Navigate to the next lesson
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !lesson) {
    return (
      <Container>
        <MarginTop sx={{ mb: 2 }} />
        <Alert severity="error">{error || 'Lesson not found'}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <MarginTop mt="64px" />

      <LessonBreadcrumbs lesson={lesson} />

      <LessonHeader
        lesson={lesson}
        bookmarked={bookmarked}
        handleBookmark={handleBookmark}
        theme={theme}
      />

      <LessonProgress value={78} />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="lesson content tabs">
            <Tab icon={<ReadIcon />} label="Content" />
            <Tab icon={<CodeIcon />} label="Exercises" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ContentTab
            lesson={lesson}
            theme={theme}
            markdownStyles={markdownStyles}
            markdownComponents={markdownComponents}
            processMarkdownContent={processMarkdownContent}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ExercisesTab
            theme={theme}
            lesson={lesson}
            markdownStyles={markdownStyles}
            markdownComponents={markdownComponents}
            processMarkdownContent={processMarkdownContent}
          />
        </TabPanel>
      </Box>

      <LessonNavigation handleBack={handleBack} handleNext={handleNext} />
    </Container>
  )
}

export default LessonDetailPage
