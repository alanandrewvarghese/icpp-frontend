import React, { useState, useEffect } from 'react'
import {
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material'
import analyticsService from '../../services/analyticsService'
import LessonAnalytics from '../../components/analytics/lesson/LessonAnalytics'
import ExerciseAnalytics from '../../components/analytics/exercise/ExerciseAnalytics'
import SandboxAnalytics from '../../components/analytics/sandbox/SandboxAnalytics'
import MarginTop from '../../components/layout/MarginTop'

// Tab panel component for content organization
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const AnalyticsPage = () => {
  // State for tab navigation
  const [activeTab, setActiveTab] = useState(0)

  // State for analytics data
  const [lessonAnalytics, setLessonAnalytics] = useState(null)
  const [exerciseAnalytics, setExerciseAnalytics] = useState(null)
  const [sandboxAnalytics, setSandboxAnalytics] = useState(null)

  // Loading and error states
  const [loading, setLoading] = useState({
    lessons: false,
    exercises: false,
    sandbox: false,
  })
  const [error, setError] = useState({
    lessons: null,
    exercises: null,
    sandbox: null,
  })

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)

    // Fetch data for the selected tab if it hasn't been loaded yet
    if (newValue === 0 && !lessonAnalytics) fetchLessonAnalytics()
    if (newValue === 1 && !exerciseAnalytics) fetchExerciseAnalytics()
    if (newValue === 2 && !sandboxAnalytics) fetchSandboxAnalytics()
  }

  // Fetch lesson analytics data
  const fetchLessonAnalytics = async () => {
    setLoading((prev) => ({ ...prev, lessons: true }))
    setError((prev) => ({ ...prev, lessons: null }))

    try {
      const data = await analyticsService.getLessonAnalytics()
      setLessonAnalytics(data)
    } catch (err) {
      setError((prev) => ({ ...prev, lessons: 'Failed to load lesson analytics' }))
    } finally {
      setLoading((prev) => ({ ...prev, lessons: false }))
    }
  }

  // Fetch exercise analytics data
  const fetchExerciseAnalytics = async () => {
    setLoading((prev) => ({ ...prev, exercises: true }))
    setError((prev) => ({ ...prev, exercises: null }))

    try {
      const data = await analyticsService.getExerciseAnalytics()
      setExerciseAnalytics(data)
    } catch (err) {
      setError((prev) => ({ ...prev, exercises: 'Failed to load exercise analytics' }))
    } finally {
      setLoading((prev) => ({ ...prev, exercises: false }))
    }
  }

  // Fetch sandbox analytics data
  const fetchSandboxAnalytics = async () => {
    setLoading((prev) => ({ ...prev, sandbox: true }))
    setError((prev) => ({ ...prev, sandbox: null }))

    try {
      const data = await analyticsService.getSandboxAnalytics()
      setSandboxAnalytics(data)
    } catch (err) {
      setError((prev) => ({ ...prev, sandbox: 'Failed to load sandbox analytics' }))
    } finally {
      setLoading((prev) => ({ ...prev, sandbox: false }))
    }
  }

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchLessonAnalytics()
  }, [])

  // Render loading state
  const renderLoading = (type) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  )

  // Render error state
  const renderError = (message) => (
    <Alert severity="error" sx={{ mt: 2 }}>
      {message}
    </Alert>
  )

  return (
    <Container maxWidth="lg">
      <MarginTop mt="90px"></MarginTop>
      <Paper elevation={2} sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            System Analytics
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Lesson Analytics" id="analytics-tab-0" />
            <Tab label="Exercise Analytics" id="analytics-tab-1" />
            <Tab label="Sandbox Analytics" id="analytics-tab-2" />
          </Tabs>

          {/* Lesson Analytics Tab */}
          <TabPanel value={activeTab} index={0}>
            {loading.lessons && renderLoading('lessons')}
            {error.lessons && renderError(error.lessons)}
            {!loading.lessons && !error.lessons && lessonAnalytics && (
              <LessonAnalytics data={lessonAnalytics} />
            )}
          </TabPanel>

          {/* Exercise Analytics Tab */}
          <TabPanel value={activeTab} index={1}>
            {loading.exercises && renderLoading('exercises')}
            {error.exercises && renderError(error.exercises)}
            {!loading.exercises && !error.exercises && exerciseAnalytics && (
              <ExerciseAnalytics data={exerciseAnalytics} />
            )}
          </TabPanel>

          {/* Sandbox Analytics Tab */}
          <TabPanel value={activeTab} index={2}>
            {loading.sandbox && renderLoading('sandbox')}
            {error.sandbox && renderError(error.sandbox)}
            {!loading.sandbox && !error.sandbox && sandboxAnalytics && (
              <SandboxAnalytics data={sandboxAnalytics} />
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  )
}

export default AnalyticsPage
