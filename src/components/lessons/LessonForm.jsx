import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { getMaxLessonOrder } from '../../services/lessonService'
import { useNavigate } from 'react-router-dom'
import EscapeCharacterProcessor from '../common/EscapeCharacterProcessor'

const LessonForm = ({
  onContentChange,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  initialTitle = '',
  initialContent = '',
  initialDescription = '',
  isEditMode = false,
}) => {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    content: '',
  })
  const navigate = useNavigate()

  // Order will be determined automatically
  const [nextOrder, setNextOrder] = useState(null)

  // Set initial values when props change
  useEffect(() => {
    setTitle(initialTitle)
    setDescription(initialDescription)
    setContent(initialContent)
  }, [initialTitle, initialDescription, initialContent])

  // Only fetch next order for new lessons, not for edits
  useEffect(() => {
    if (!isEditMode) {
      const fetchNextOrder = async () => {
        try {
          const maxOrder = await getMaxLessonOrder()
          setNextOrder(maxOrder + 1)
        } catch (err) {
          console.error('Error fetching max lesson order:', err)
          setNextOrder(1) // Default to 1 if there's an error
        }
      }
      fetchNextOrder()
    }
  }, [isEditMode])

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (title || description || content) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [title, description, content])

  // Modified handlers to update parent component in real-time
  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (onTitleChange) onTitleChange(newTitle) // Update parent immediately
    if (errors.title && newTitle.trim()) {
      setErrors((prev) => ({ ...prev, title: '' }))
    }
  }

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value
    setDescription(newDescription)
    if (onDescriptionChange) onDescriptionChange(newDescription) // Update parent immediately
    if (errors.description && newDescription.trim()) {
      setErrors((prev) => ({ ...prev, description: '' }))
    }
  }

  const handleContentChange = (processedContent) => {
    setContent(processedContent)
    if (onContentChange) onContentChange(processedContent) // Update parent immediately
    if (errors.content && processedContent.trim()) {
      setErrors((prev) => ({ ...prev, content: '' }))
    }
  }

  // These can be kept for backwards compatibility
  const handleTitleBlur = () => {
    if (onTitleChange) onTitleChange(title)
  }

  const handleDescriptionBlur = () => {
    if (onDescriptionChange) onDescriptionChange(description)
  }

  const handleContentBlur = () => {
    if (onContentChange) onContentChange(content)
  }

  const validateForm = () => {
    const newErrors = {
      title: !title.trim() ? 'Title is required' : '',
      description: !description.trim() ? 'Description is required' : '',
      content: !content.trim() ? 'Content is required' : '',
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      // All fields are already synced with parent through onChange
      if (onSubmit) {
        await onSubmit({
          title,
          description,
          content,
          order: nextOrder,
        })
        setSuccessMessage(
          isEditMode ? 'Lesson updated successfully!' : 'Lesson created successfully!',
        )
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again later.')
      console.error('Lesson submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    // Reset to initial values from props
    setTitle(initialTitle)
    setDescription(initialDescription)
    setContent(initialContent)

    // Also update parent component to keep preview in sync
    if (onTitleChange) onTitleChange(initialTitle)
    if (onDescriptionChange) onDescriptionChange(initialDescription)
    if (onContentChange) onContentChange(initialContent)

    setErrors({
      title: '',
      description: '',
      content: '',
    })
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 0.5, minHeight: 'calc(100vh - 120px)' }}>
      <Typography variant="h5" sx={{ textAlign: 'left', mb: 3, fontWeight: 500 }}>
        {isEditMode ? 'Edit Lesson' : 'Add New Lesson'}
      </Typography>

      <Collapse in={!!error}>
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Collapse>

      <Collapse in={!!successMessage}>
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setSuccessMessage('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {successMessage}
        </Alert>
      </Collapse>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            fullWidth
            id="title"
            label="Lesson Title"
            variant="outlined"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            required
            error={!!errors.title}
            helperText={errors.title || 'A concise, descriptive title for the lesson'}
            inputProps={{ maxLength: 100 }}
            disabled={loading}
          />

          <TextField
            fullWidth
            id="description"
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            required
            error={!!errors.description}
            helperText={errors.description || 'Brief overview of what this lesson covers'}
            disabled={loading}
          />

          <Box>
            <EscapeCharacterProcessor
              initialValue={content}
              onChange={handleContentChange}
              onBlur={handleContentBlur} // Update parent on blur
              label="Content (Markdown Format)"
              rows={10}
              error={!!errors.content}
              helperText={errors.content || 'Use Markdown formatting for lesson content'}
              disabled={loading}
            />
          </Box>

          {/* Only show order for new lessons */}
          {!isEditMode && (
            <Typography variant="body2" color="text.secondary">
              This lesson will be added at position #{nextOrder || '...'}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset the form?')) {
                  resetForm()
                }
              }}
              disabled={loading}
            >
              Reset Form
            </Button>

            <Box>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => navigate('/lessons')}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                disabled={loading || (!isEditMode && nextOrder === null)}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading
                  ? isEditMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditMode
                    ? 'Update Lesson'
                    : 'Add Lesson'}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

export default LessonForm
