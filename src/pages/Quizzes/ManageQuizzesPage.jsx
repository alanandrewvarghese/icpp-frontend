import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import BarChartIcon from '@mui/icons-material/BarChart'
import VisibilityIcon from '@mui/icons-material/Visibility'

import quizService from '../../services/quizService'
import AuthCheck from '../../components/AuthCheck'
import MarginTop from '../../components/layout/MarginTop'
import { AuthContext } from '../../contexts/AuthContext'

const ManageQuizzesPage = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const data = await quizService.getAllQuizzes()
      setQuizzes(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching quizzes:', err)
      setError('Failed to load quizzes. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz)
    setConfirmDeleteOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await quizService.deleteQuiz(quizToDelete.id)
      setConfirmDeleteOpen(false)
      setQuizToDelete(null)
      // Refresh quizzes list
      fetchQuizzes()
    } catch (err) {
      setError(`Failed to delete quiz: ${err.message}`)
      setConfirmDeleteOpen(false)
    }
  }

  const cancelDelete = () => {
    setConfirmDeleteOpen(false)
    setQuizToDelete(null)
  }

  if (!user || !['instructor', 'admin'].includes(user.role)) {
    return (
      <Container>
        <MarginTop mt="64px" />
        <Alert severity="warning">You do not have permission to access this page.</Alert>
      </Container>
    )
  }

  return (
    <AuthCheck allowedRoles={['instructor', 'admin']}>
      <Container maxWidth="lg">
        <MarginTop mt="90px" />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Quizzes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/quizzes/create')}
          >
            Create New Quiz
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : quizzes.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography>No quizzes found. Create your first quiz to get started!</Typography>
          </Paper>
        ) : (
          <Paper sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Lesson</TableCell>
                  <TableCell align="center">Passing Score</TableCell>
                  <TableCell align="center">Questions</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>
                      {quiz.description?.length > 50
                        ? `${quiz.description.substring(0, 50)}...`
                        : quiz.description}
                    </TableCell>
                    <TableCell>{quiz.lesson_title || 'No lesson'}</TableCell>
                    <TableCell align="center">{quiz.passing_score}%</TableCell>
                    <TableCell align="center">{quiz.questions?.length || 0}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        title="Edit Quiz"
                        onClick={() => navigate(`/quizzes/edit/${quiz.id}`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        title="View Statistics"
                        onClick={() => navigate(`/quizzes/stats/${quiz.id}`)}
                      >
                        <BarChartIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        title="Preview Quiz"
                        onClick={() => navigate(`/quizzes/take/${quiz.id}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        title="Delete Quiz"
                        onClick={() => handleDeleteClick(quiz)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Confirm Delete Dialog */}
        {confirmDeleteOpen && (
          <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the quiz "{quizToDelete?.title}"? This action cannot
                be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete}>Cancel</Button>
              <Button onClick={confirmDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </AuthCheck>
  )
}

export default ManageQuizzesPage
