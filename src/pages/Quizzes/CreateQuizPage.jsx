import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material'

import { QuizProvider } from '../../components/quiz/context/QuizContext'
import Quiz from '../../components/quiz/Quiz'
import QuizQuestionEditor from '../../components/quiz/QuizQuestionEditor'
import AuthCheck from '../../components/AuthCheck'
import MarginTop from '../../components/layout/MarginTop'
import quizService from '../../services/quizService'

const CreateQuizPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const lessonId = searchParams.get('lessonId')
  const [error, setError] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [createdQuiz, setCreatedQuiz] = useState(null)
  const [questions, setQuestions] = useState([])

  const steps = ['Quiz Details', 'Add Questions', 'Review & Submit']

  const handleQuizCreated = (quiz) => {
    // Store the created quiz and move to question creation step
    if (quiz && quiz.id) {
      setCreatedQuiz(quiz)
      setActiveStep(1) // Move to the next step
    }
  }

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question])
  }

  const handleUpdateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = updatedQuestion
    setQuestions(updatedQuestions)
  }

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)
  }

  const handleSubmitQuestions = async () => {
    if (!createdQuiz || questions.length === 0) return

    try {
      setError(null)
      // Format questions for the bulk update API
      const formattedQuestions = questions.map((q, idx) => ({
        text: q.text,
        order: idx + 1,
        choices: q.choices.map((choice) => ({
          text: choice.text,
          is_correct: choice.isCorrect,
        })),
      }))

      await quizService.bulkUpdateQuiz(createdQuiz.id, {
        questions: formattedQuestions,
      })

      setActiveStep(2) // Move to review step
    } catch (err) {
      setError('Failed to save questions: ' + (err.message || 'Unknown error'))
    }
  }

  const handleFinish = () => {
    navigate('/quizzes/manage')
  }

  return (
    <AuthCheck allowedRoles={['instructor', 'admin']}>
      <Container maxWidth="lg">
        <MarginTop mt="90px" />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1">
            Create New Quiz
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Paper sx={{ p: 3 }}>
          {activeStep === 0 && (
            <QuizProvider>
              <Quiz mode="create" lessonId={lessonId} onSave={handleQuizCreated} />
            </QuizProvider>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Add Questions to {createdQuiz?.title}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <QuizQuestionEditor
                questions={questions}
                onAddQuestion={handleAddQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onRemoveQuestion={handleRemoveQuestion}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/quizzes/edit/${createdQuiz.id}`)}
                >
                  Skip & Edit Later
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitQuestions}
                  disabled={questions.length === 0}
                >
                  Save Questions & Continue
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Quiz created successfully with {questions.length} questions!
              </Alert>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleFinish}>
                  Finish
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </AuthCheck>
  )
}

export default CreateQuizPage
