import React, { useState, useEffect } from 'react'
import { fetchExercise, deleteExercise } from '../../services/exerciseService'
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Divider,
  alpha,
  useTheme,
  List,
  ListItem,
  Grid,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeIcon from '@mui/icons-material/Code'
import InputIcon from '@mui/icons-material/Input'
import OutputIcon from '@mui/icons-material/Output'
import ReactMarkdown from 'react-markdown'
import TestCasesDisplay from './TestCasesDisplay'
import AuthCheck from '../AuthCheck'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'

const ExerciseDetail = ({ exerciseId }) => {
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  const theme = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const loadExercise = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchExercise(exerciseId)
        setExercise(data)
      } catch (err) {
        setError(err.message || 'Failed to load exercise details.')
        console.error('Failed to fetch exercise details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (exerciseId) {
      loadExercise()
    }
  }, [exerciseId])

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleDeleteConfirm = async () => {
    setDeleteInProgress(true)
    try {
      await deleteExercise(exerciseId)
      setDeleteDialogOpen(false)
      navigate(`/lessons/${exercise.lesson}`, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to delete exercise.')
      console.error('Failed to delete exercise:', err)
    } finally {
      setDeleteInProgress(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !exercise) {
    return <Alert severity="error">{error || 'Exercise not found'}</Alert>
  }

  const renderTestCases = () => {
    return <TestCasesDisplay testCases={exercise.test_cases} />
  }

  return (
    <Paper elevation={0} variant="" sx={{ p: 0, borderRadius: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
            p: 1.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <CodeIcon color="primary" />
        </Box>
        <Typography variant="h5" component="h2" fontWeight="500">
          {exercise.title}
        </Typography>

        {/* Edit and Delete buttons for instructors/admins */}
        <AuthCheck allowedRoles={['instructor', 'admin']} createdBy={exercise.author_name}>
          {console.log(exercise)}
          <Button
            sx={{ ml: 2 }}
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/exercises/edit/${exercise.id}`)}
          >
            Edit
          </Button>
          <Button
            sx={{ ml: 1 }}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </AuthCheck>
      </Box>

      <Box sx={{ mb: 3 }}>
        <ReactMarkdown
          components={{
            p: (props) => <Typography variant="body1" paragraph sx={{ mb: 1.5 }} {...props} />,
            h1: (props) => <Typography variant="h5" gutterBottom {...props} />,
            h2: (props) => <Typography variant="h6" gutterBottom {...props} />,
            h3: (props) => (
              <Typography variant="subtitle1" fontWeight="500" gutterBottom {...props} />
            ),
            ul: (props) => <Box component="ul" sx={{ pl: 2 }} {...props} />,
            ol: (props) => <Box component="ol" sx={{ pl: 2 }} {...props} />,
            li: (props) => (
              <Typography component="li" variant="body1" sx={{ mb: 0.5 }} {...props} />
            ),
            code: (props) => (
              <Box
                component="code"
                sx={{
                  bgcolor: alpha(theme.palette.grey[900], 0.07),
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
                {...props}
              />
            ),
          }}
        >
          {exercise.description}
        </ReactMarkdown>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Test Cases
        </Typography>
        {renderTestCases()}
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this exercise? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteInProgress}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteInProgress}
            startIcon={deleteInProgress ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleteInProgress ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default ExerciseDetail
