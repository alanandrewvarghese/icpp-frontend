import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as TakeQuizIcon,
} from '@mui/icons-material'

import { useQuiz, QUIZ_ACTIONS } from '../context/QuizContext'
import quizService from '../../../services/quizService'

const QuizList = ({ lessonId = null }) => {
  const { state, dispatch } = useQuiz()
  const { quizzes, loading, error, userRole } = state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        dispatch({ type: QUIZ_ACTIONS.SET_LOADING })
        let quizData

        // If lessonId is provided, get quizzes only for that lesson
        if (lessonId) {
          quizData = await quizService.getQuizForLesson(lessonId)
        } else {
          quizData = await quizService.getAllQuizzes()
        }

        dispatch({ type: QUIZ_ACTIONS.SET_QUIZZES, payload: quizData })
      } catch (err) {
        dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: err.message })
      }
    }

    fetchQuizzes()
  }, [dispatch, lessonId])

  const handleEditQuiz = (quizId) => {
    navigate(`/quizzes/edit/${quizId}`)
  }

  const handleDeleteQuiz = (quiz) => {
    setQuizToDelete(quiz)
    setConfirmDeleteOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await quizService.deleteQuiz(quizToDelete.id)
      dispatch({
        type: QUIZ_ACTIONS.REMOVE_QUIZ,
        payload: quizToDelete.id,
      })
      setConfirmDeleteOpen(false)
      setQuizToDelete(null)
    } catch (err) {
      dispatch({
        type: QUIZ_ACTIONS.SET_ERROR,
        payload: `Failed to delete quiz: ${err.message}`,
      })
    }
  }

  const cancelDelete = () => {
    setConfirmDeleteOpen(false)
    setQuizToDelete(null)
  }

  const handleTakeQuiz = (quizId) => {
    navigate(`/quizzes/take/${quizId}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {lessonId ? 'Lesson Quizzes' : 'All Quizzes'}
        </Typography>
        {['admin', 'instructor'].includes(userRole) && (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(lessonId ? `/quizzes/create?lessonId=${lessonId}` : '/quizzes/create')
            }
          >
            Create New Quiz
          </Button>
        )}
      </Box>

      {quizzes.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No quizzes available.
            {['admin', 'instructor'].includes(userRole) && ' Click the button above to create one.'}
          </Typography>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {quizzes.map((quiz) => (
            <Card key={quiz.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {quiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  {quiz.description || 'No description provided'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip
                    label={`Lesson: ${quiz.lesson_title || 'Unknown'}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Passing Score: ${quiz.passing_score}%`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Created by: ${quiz.created_by_username || 'Unknown'}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                {['admin', 'instructor'].includes(userRole) && (
                  <>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditQuiz(quiz.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteQuiz(quiz)}
                    >
                      Delete
                    </Button>
                  </>
                )}
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<TakeQuizIcon />}
                  onClick={() => handleTakeQuiz(quiz.id)}
                >
                  Take Quiz
                </Button>
              </CardActions>
            </Card>
          ))}
        </List>
      )}

      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the quiz "{quizToDelete?.title}"? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QuizList
