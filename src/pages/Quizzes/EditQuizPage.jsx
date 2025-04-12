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
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { QuizProvider } from '../../components/quiz/context/QuizContext'
import Quiz from '../../components/quiz/Quiz'
import QuestionForm from '../../components/quiz/instructor/QuestionForm'
import quizService from '../../services/quizService'
import AuthCheck from '../../components/AuthCheck'
import MarginTop from '../../components/layout/MarginTop'

// Simple TabPanel component
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const EditQuizPage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [questions, setQuestions] = useState([])
  const [editingQuestion, setEditingQuestion] = useState(null)

  useEffect(() => {
    if (!quizId) return

    const fetchQuizData = async () => {
      try {
        setLoading(true)
        // Use getQuiz instead of bulkUpdateQuiz to fetch quiz data
        const quizData = await quizService.getQuiz(quizId)
        console.log(quizData)
        setQuiz(quizData)
        setQuestions(quizData.questions || [])
      } catch (err) {
        console.error('Error fetching quiz:', err)
        setError('Failed to load quiz. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
  }, [quizId])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleQuizUpdated = (updatedQuiz) => {
    setQuiz(updatedQuiz)
    // Navigate to the Questions tab after successful update
    setTabValue(1)
  }

  const handleQuestionSaved = (savedQuestion) => {
    // Update the questions list
    if (editingQuestion) {
      // If editing, replace the existing question
      setQuestions(questions.map((q) => (q.id === savedQuestion.id ? savedQuestion : q)))
    } else {
      // If adding new, append to the list
      setQuestions([...questions, savedQuestion])
    }

    setEditingQuestion(null)
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion(question)
    setTabValue(1) // Switch to the Questions tab
  }

  const handleDeleteQuestion = async (questionId) => {
    try {
      await quizService.deleteQuestion(questionId)
      setQuestions(questions.filter((q) => q.id !== questionId))
    } catch (err) {
      setError(`Failed to delete question: ${err.message}`)
    }
  }

  const handleCancelQuestion = () => {
    setEditingQuestion(null)
  }

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
            Edit Quiz
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Quiz Details" />
              <Tab label="Questions" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <QuizProvider>
              <Quiz mode="edit" id={quizId} onSave={handleQuizUpdated} />
            </QuizProvider>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Questions
              </Typography>

              {editingQuestion ? (
                <QuestionForm
                  quizId={quizId}
                  question={editingQuestion}
                  onSave={handleQuestionSaved}
                  onCancel={handleCancelQuestion}
                />
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditingQuestion({})}
                    sx={{ mb: 2 }}
                  >
                    Add New Question
                  </Button>

                  {questions.length === 0 ? (
                    <Typography sx={{ mt: 2 }}>
                      No questions added yet. Click "Add New Question" to create your first
                      question.
                    </Typography>
                  ) : (
                    <Paper variant="outlined" sx={{ mt: 2 }}>
                      {questions.map((question, index) => (
                        <Box
                          key={question.id}
                          sx={{
                            p: 2,
                            borderBottom:
                              index < questions.length - 1
                                ? '1px solid rgba(0, 0, 0, 0.12)'
                                : 'none',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">
                              Question {question.order}: {question.text}
                            </Typography>
                            <Box>
                              <Button
                                color="primary"
                                size="small"
                                onClick={() => handleEditQuestion(question)}
                                sx={{ mr: 1 }}
                              >
                                Edit
                              </Button>
                              <Button
                                color="error"
                                size="small"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>

                          <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
                            Answer Choices:
                          </Typography>
                          <ul style={{ margin: 0 }}>
                            {question.choices?.map((choice) => (
                              <li key={choice.id}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: choice.is_correct ? 'bold' : 'normal',
                                    color: choice.is_correct ? 'success.main' : 'text.primary',
                                  }}
                                >
                                  {choice.text} {choice.is_correct && '(Correct)'}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      ))}
                    </Paper>
                  )}
                </>
              )}
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </AuthCheck>
  )
}

export default EditQuizPage
