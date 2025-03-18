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
  Divider,
  Tooltip,
} from '@mui/material'
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material'
import { createLesson, getMaxLessonOrder } from '../../services/lessonService'
import { useNavigate } from 'react-router-dom'
import EscapeCharacterProcessor from '../common/EscapeCharacterProcessor'

const LessonForm = ({ onContentChange, onTitleChange }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
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

  // Fetch the next available order value when component mounts
  useEffect(() => {
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
  }, [])

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

  // Update parent component when content changes
  useEffect(() => {
    if (onContentChange) {
      onContentChange(content)
    }
  }, [content, onContentChange])

  // Update parent component when title changes
  useEffect(() => {
    if (onTitleChange) {
      onTitleChange(title)
    }
  }, [title, onTitleChange])

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
    setError('')
    setSuccessMessage('')

    if (!validateForm()) return

    setLoading(true)

    const lessonData = {
      title,
      description,
      content,
      order: nextOrder, // Use the automatically determined order
    }

    try {
      const response = await createLesson(lessonData)
      if (response && response.id) {
        setSuccessMessage('Lesson created successfully!')
        // Redirect to lesson list where reordering can happen
        navigate('/lessons')
      } else if (response && response.error) {
        setError(response.error)
      } else {
        setError('Failed to create lesson. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.')
      console.error('Lesson creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setContent('')
    setErrors({
      title: '',
      description: '',
      content: '',
    })
    // Don't reset nextOrder as it should remain the same
  }

  const handleContentChange = (processedContent) => {
    setContent(processedContent)
    if (errors.content && processedContent.trim()) {
      // Clear content error if content is provided
      setErrors((prev) => ({ ...prev, content: '' }))
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 0.5 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 500 }}>
        Add New Lesson
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
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={(e) => setDescription(e.target.value)}
            required
            error={!!errors.description}
            helperText={errors.description || 'Brief overview of what this lesson covers'}
            disabled={loading}
          />

          <Box>
            <EscapeCharacterProcessor
              initialValue={content}
              onChange={handleContentChange}
              label="Content (Markdown Format)"
              rows={10}
              error={!!errors.content}
              helperText={errors.content || 'Use Markdown formatting for lesson content'}
              disabled={loading}
            />
          </Box>

          {/* Show the position where the lesson will be added */}
          <Typography variant="body2" color="text.secondary">
            This lesson will be added at position #{nextOrder || '...'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the form?')) {
                  resetForm()
                }
              }}
              disabled={loading}
            >
              Clear Form
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
                disabled={loading || nextOrder === null}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Creating...' : 'Add Lesson'}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

export default LessonForm
