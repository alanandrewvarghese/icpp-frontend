import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import AuthCheck from '../../../AuthCheck'
import { QuizProvider } from '../../../quiz/context/QuizContext'
import quizService from '../../../../services/quizService'
import Quiz from '../../../quiz/Quiz'
import CompletionStatus from '../../../common/CompletionStatus'

const QuizTab = ({ lesson, theme }) => {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewingQuiz, setViewingQuiz] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLessonQuiz = async () => {
      if (!lesson || !lesson.id) return

      try {
        setLoading(true)
        setError(null)

        try {
          const quizData = await quizService.getQuizForLesson(lesson.id)
          setQuiz(quizData)
          console.log('Fetched quiz data:', quizData)
        } catch (err) {
          // Check if error is 404 Not Found - this is expected if no quiz exists
          if (err.response && err.response.status === 404) {
            console.log('No quiz found for this lesson')
            setQuiz(null)
          } else {
            // Rethrow for other errors
            throw err
          }
        }
      } catch (err) {
        console.error('Error fetching quiz:', err)
        setError(err.message || 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    fetchLessonQuiz()
  }, [lesson])

  const handleViewQuiz = () => {
    setViewingQuiz(true)
  }

  const handleBackToSummary = () => {
    setViewingQuiz(false)
  }

  const renderCreateQuizButton = () => (
    <AuthCheck allowedRoles={['instructor', 'admin']}>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/quizzes/create?lessonId=${lesson.id}`)}
        >
          Create Quiz
        </Button>
      </Box>
    </AuthCheck>
  )

  if (!lesson || !lesson.id) {
    return (
      <Typography variant="body1" color="text.secondary">
        No lesson selected.
      </Typography>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          Error loading quiz: {error}
        </Typography>
        {renderCreateQuizButton()}
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 1 }} elevation={0} variant="outlined">
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 500 }}>
        Quiz
      </Typography>

      <QuizProvider>
        {quiz && viewingQuiz ? (
          <Box>
            <Button onClick={handleBackToSummary} sx={{ mb: 2 }}>
              Back to Quiz Summary
            </Button>
            <Quiz mode="detail" id={quiz.id} />
          </Box>
        ) : quiz ? (
          <Box>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Typography variant="h6">{quiz.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CompletionStatus contentType="quiz" contentId={quiz.id} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {quiz.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption">Passing Score: {quiz.passing_score}%</Typography>
                <Box>
                  {/* <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleViewQuiz}
                    sx={{ mr: 1 }}
                  >
                    View Quiz
                  </Button> */}
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/quizzes/take/${quiz.id}`)}
                  >
                    Take Quiz
                  </Button>
                </Box>
              </Box>
            </Paper>
            <AuthCheck allowedRoles={['instructor', 'admin']}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/quizzes/edit/${quiz.id}`)}
              >
                Edit Quiz
              </Button>
            </AuthCheck>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No quiz has been created for this lesson yet.
            </Typography>
            {renderCreateQuizButton()}
          </Box>
        )}
      </QuizProvider>
    </Paper>
  )
}

export default QuizTab
