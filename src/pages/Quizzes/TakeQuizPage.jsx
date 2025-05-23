import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
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
import MarginTop from '../../components/layout/MarginTop'

const TakeQuizPage = () => {
  const navigate = useNavigate()
  const { quizId } = useParams()
  const location = useLocation()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Extract the returnTo path if it exists in the state
  const returnTo = location.state?.returnTo || '/lessons'

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true)
        const quizData = await quizService.getQuiz(quizId)
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
        <Button variant="contained" onClick={() => navigate(returnTo)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <MarginTop mt="90px" />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Attempt Quiz
        </Typography>
      </Box>

      <QuizProvider>
        <Quiz mode="take" id={quizId} />
      </QuizProvider>
    </Container>
  )
}

export default TakeQuizPage
