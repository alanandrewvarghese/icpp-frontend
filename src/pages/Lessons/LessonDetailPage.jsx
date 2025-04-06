import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchLesson } from '../../services/lessonService'
import { fetchLessonProgress } from '../../services/progressService'
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

import TabPanel from '../../components/lessons/lessonDetails/TabPanel'
import ContentTab from '../../components/lessons/lessonDetails/tabs/ContentTab'
import ExercisesTab from '../../components/lessons/lessonDetails/tabs/ExercisesTab'
import LessonHeader from '../../components/lessons/lessonDetails/LessonHeader'
import LessonBreadcrumbs from '../../components/lessons/lessonDetails/LessonBreadcrumbs'
import LessonProgress from '../../components/lessons/lessonDetails/LessonProgress'
import MarginTop from '../../components/layout/MarginTop'

import {
  getMarkdownStyles,
  markdownComponents,
  processMarkdownContent,
} from '../../utils/markdownUtils'

const LessonDetailPage = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()

  const markdownStyles = getMarkdownStyles(theme)

  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    const getLesson = async () => {
      try {
        setLoading(true)
        const data = await fetchLesson(lessonId)
        const progressData = await fetchLessonProgress(lessonId)
        setLesson(data)
        setProgress(progressData)
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
    const queryParams = new URLSearchParams(window.location.search)
    const tab = queryParams.get('tab')

    if (tab === 'exercises') {
      setTabValue(1)
    }
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
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

      <LessonHeader lesson={lesson} theme={theme} />

      <LessonProgress value={progress.progress_percentage} />

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
    </Container>
  )
}

export default LessonDetailPage
