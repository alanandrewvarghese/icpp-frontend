import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { QuizProvider } from '../../components/quiz/context/QuizContext'
import Quiz from '../../components/quiz/Quiz'
import quizService from '../../services/quizService'
import AuthCheck from '../../components/AuthCheck'
import MarginTop from '../../components/layout/MarginTop'

const QuizStatisticsPage = () => {
  const navigate = useNavigate()
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true)
        const quizData = await quizService.getQuizStats(quizId)
        setQuiz(quizData)
      } catch (err) {
        console.error('Error fetching quiz:', err)
        setError('Failed to load quiz. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuizData()
    }
  }, [quizId])

  if (loading) {
    return (
      <Container>
        <MarginTop mt="64px" />
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !quiz) {
    return (
      <Container>
        <MarginTop mt="64px" />
        <Alert severity="error">{error || 'Quiz not found'}</Alert>
        <Button variant="contained" onClick={() => navigate('/quizzes/manage')} sx={{ mt: 2 }}>
          Back to Quizzes
        </Button>
      </Container>
    )
  }

  return (
    <AuthCheck allowedRoles={['instructor', 'admin']}>
      <Container maxWidth="lg">
        <MarginTop mt="90px" />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Statistics
          </Typography>
        </Box>

        <QuizProvider>
          <Quiz mode="stats" id={quizId} />
        </QuizProvider>
      </Container>
    </AuthCheck>
  )
}

export default QuizStatisticsPage
