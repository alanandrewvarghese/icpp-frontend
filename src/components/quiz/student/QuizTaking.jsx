import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useQuiz, QUIZ_ACTIONS } from '../context/QuizContext'
import quizService from '../../../services/quizService'
import { useNavigate } from 'react-router-dom'

const QuizTaking = ({ quizId }) => {
  const { state, dispatch } = useQuiz()
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate() // Add navigate hook

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const quizData = await quizService.getQuiz(quizId)
        setCurrentQuiz(quizData)

        // Initialize answers object
        const initialAnswers = {}
        quizData.questions.forEach((question) => {
          initialAnswers[question.id] = null
        })
        setAnswers(initialAnswers)
      } catch (err) {
        dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: err.message })
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId, dispatch])

  const handleAnswerChange = (questionId, choiceId) => {
    setAnswers({
      ...answers,
      [questionId]: choiceId,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      // Format answers for API submission
      const formattedAnswers = Object.entries(answers).map(([questionId, choiceId]) => ({
        [questionId]: choiceId,
      }))

      const submissionResult = await quizService.submitQuiz(quizId, formattedAnswers)
      setResult(submissionResult)
    } catch (error) {
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handlePrevQuestion = () => {
    setActiveStep((prev) => prev - 1)
  }

  // Check if all questions are answered
  const allQuestionsAnswered = () => {
    if (!currentQuiz) return false
    return currentQuiz.questions.every((question) => answers[question.id] !== null)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentQuiz) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Quiz not found
      </Alert>
    )
  }

  // If the quiz has been submitted and we have results
  if (result) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Quiz Results
        </Typography>
        <Card
          variant="outlined"
          sx={{
            mt: 2,
            borderColor: result.passed ? 'success.main' : 'error.main',
            backgroundColor: result.passed ? 'success.light' : 'error.light',
            opacity: 0.8,
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              {result.passed ? (
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              ) : (
                <CancelIcon color="error" sx={{ fontSize: 40 }} />
              )}
              <Typography
                variant="h5"
                component="h3"
                color={result.passed ? 'success.dark' : 'error.dark'}
              >
                {result.passed ? 'Congratulations! Quiz Passed' : 'Quiz Not Passed'}
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {result.message}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="subtitle2">Your score</Typography>
                <Typography variant="h4" component="p" fontWeight="bold">
                  {result.score}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Required to pass</Typography>
                <Typography variant="h4" component="p" color="text.secondary">
                  {currentQuiz.passing_score}%
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2 }}>
          {result.passed ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/lessons')}
              size="large"
            >
              Return to Lessons
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setResult(null)}
              size="large"
            >
              Try Again
            </Button>
          )}
        </Box>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {currentQuiz.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {currentQuiz.description}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          Passing Score Required:
        </Typography>
        <Chip label={`${currentQuiz.passing_score}%`} color="primary" size="small" />
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Desktop view: Display all questions */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {currentQuiz.questions.map((question, qIndex) => (
            <Card key={question.id} variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Question {qIndex + 1}: {question.text}
                </Typography>
                <FormControl component="fieldset" required sx={{ width: '100%', mt: 2 }}>
                  <FormLabel component="legend" sx={{ sr: 'only' }}>
                    Choose an answer
                  </FormLabel>
                  <RadioGroup
                    name={`question-${question.id}`}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  >
                    <Stack spacing={1}>
                      {question.choices.map((choice) => (
                        <FormControlLabel
                          key={choice.id}
                          value={choice.id}
                          control={<Radio />}
                          label={choice.text}
                          sx={{
                            p: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting || !allQuestionsAnswered()}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Quiz'}
            </Button>
          </Box>
        </Box>

        {/* Mobile view: Use stepper for questions */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {currentQuiz.questions.map((question, qIndex) => (
              <Step key={question.id}>
                <StepLabel>Question {qIndex + 1}</StepLabel>
                <StepContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {question.text}
                  </Typography>
                  <FormControl component="fieldset" required sx={{ width: '100%', mb: 2 }}>
                    <RadioGroup
                      name={`question-${question.id}`}
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    >
                      <Stack spacing={1}>
                        {question.choices.map((choice) => (
                          <FormControlLabel
                            key={choice.id}
                            value={choice.id}
                            control={<Radio />}
                            label={choice.text}
                            sx={{
                              p: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                            }}
                          />
                        ))}
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={handlePrevQuestion}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={
                        activeStep === currentQuiz.questions.length - 1 ? null : handleNextQuestion
                      }
                      type={activeStep === currentQuiz.questions.length - 1 ? 'submit' : 'button'}
                      disabled={answers[question.id] === null}
                    >
                      {activeStep === currentQuiz.questions.length - 1 ? (
                        submitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Submit'
                        )
                      ) : (
                        'Next'
                      )}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>
    </Paper>
  )
}

export default QuizTaking
