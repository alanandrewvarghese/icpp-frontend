import React, { useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined'

import { useQuiz, QUIZ_ACTIONS } from '../context/QuizContext'
import quizService from '../../../services/quizService'

const QuizDetail = ({ quizId }) => {
  const { state, dispatch } = useQuiz()
  const { currentQuiz, loading, error } = state

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        dispatch({ type: QUIZ_ACTIONS.SET_LOADING })
        const quizData = await quizService.getQuiz(quizId)
        dispatch({ type: QUIZ_ACTIONS.SET_CURRENT_QUIZ, payload: quizData })
      } catch (err) {
        dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: err.message })
      }
    }

    fetchQuizDetails()
  }, [quizId, dispatch])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!currentQuiz) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Quiz not found
      </Alert>
    )
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {currentQuiz.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {currentQuiz.description || 'No description provided'}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <SchoolOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="body2">
                <strong>Lesson:</strong> {currentQuiz.lesson_title || 'Not assigned'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonOutlineOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="body2">
                <strong>Created by:</strong> {currentQuiz.created_by_username || 'Unknown'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <GradeOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="body2">
                <strong>Passing Score:</strong> {currentQuiz.passing_score}%
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <QuestionAnswerOutlinedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            Questions
          </Typography>
          <Chip
            label={`${currentQuiz.questions?.length || 0} ${currentQuiz.questions?.length === 1 ? 'question' : 'questions'}`}
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>

        {currentQuiz.questions && currentQuiz.questions.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {currentQuiz.questions.map((question, index) => (
              <React.Fragment key={question.id}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" component="h3">
                      Question {index + 1}: {question.text}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <List dense>
                      {question.choices.map((choice) => {
                        const isCorrect = choice.is_correct

                        return (
                          <ListItem key={choice.id} disableGutters>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {isCorrect ? (
                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                              ) : (
                                <RadioButtonUncheckedIcon fontSize="small" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={choice.text}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontWeight: isCorrect ? 600 : 400,
                                  color: isCorrect ? 'success.main' : 'text.primary',
                                },
                              }}
                            />
                          </ListItem>
                        )
                      })}
                    </List>
                  </CardContent>
                </Card>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography variant="body1" color="text.secondary">
              No questions available for this quiz.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default QuizDetail
