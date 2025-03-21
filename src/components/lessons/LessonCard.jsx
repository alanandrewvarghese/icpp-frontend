import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardMedia,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import AuthCheck from '../AuthCheck'
import SchoolIcon from '@mui/icons-material/School'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useTheme, alpha } from '@mui/material/styles'
import { deleteLesson } from '../../services/lessonService'

const LessonCard = ({ lesson, onLessonDeleted }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  if (!lesson) {
    return (
      <Card
        sx={{
          height: '100%',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <CardContent
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}
        >
          <Typography>Loading Lesson...</Typography>
        </CardContent>
      </Card>
    )
  }

  const handleCardClick = () => {
    navigate(`/lessons/${lesson.id}`)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation() // Prevent card navigation
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      setDeleteError(null) // Clear any previous errors

      await deleteLesson(lesson.id)
      console.log('Lesson deleted')
      setIsDeleteDialogOpen(false)
      setDeleteSuccess(true) // Show success notification

      // Call the callback function to update the parent component
      if (onLessonDeleted && typeof onLessonDeleted === 'function') {
        onLessonDeleted()
      }
    } catch (error) {
      console.error('Error deleting lesson', error)
      setDeleteError(
        error.message || 'An error occurred while deleting the lesson. Please try again.',
      )
      setIsDeleteDialogOpen(false) // Close dialog on error but show error message
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setDeleteError(null) // Clear any previous errors
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setDeleteError(null)
    setDeleteSuccess(false)
  }

  const handleEditClick = (e) => {
    e.stopPropagation() // Prevent card navigation
    e.preventDefault() // Prevent default link behavior
    navigate(`/lessons/edit/${lesson.id}`)
  }

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <CardActionArea
        component={Link}
        to={`/lessons/${lesson.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          sx={{
            height: 140,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 60,
              color: theme.palette.primary.main,
            }}
          />
        </CardMedia>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            noWrap
            sx={{
              fontWeight: 'medium',
              mb: 1,
            }}
          >
            {lesson.title}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 4,
              height: '4rem',
            }}
          >
            {lesson.description && lesson.description.length > 50
              ? `${lesson.description.substring(0, 80)}...`
              : lesson.description}
          </Typography>

          {/* Commented out category and duration section */}
        </CardContent>
      </CardActionArea>
      <AuthCheck
        allowedRoles={['admin', 'instructor']}
        createdBy={lesson.author_name}
        allowedInstructor="nova"
      >
        <Box position="absolute" top={8} right={8} sx={{ display: 'flex', gap: 1, zIndex: 1 }}>
          {console.log(lesson)}
          <IconButton
            color="info"
            onClick={handleEditClick}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
            size="small"
            aria-label="Edit lesson"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={handleDeleteClick}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            }}
            size="small"
            aria-label="Delete lesson"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </AuthCheck>

      {/* Delete confirmation dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent id="delete-dialog-description">
          Are you sure you want to delete this lesson?
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary" disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!deleteError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {deleteError}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Lesson successfully deleted
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default LessonCard
