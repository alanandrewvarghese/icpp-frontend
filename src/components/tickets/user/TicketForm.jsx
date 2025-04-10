import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Alert,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
} from '@mui/material'
import ticketService from '../../../services/ticketService'
import { fetchLessons } from '../../../services/lessonService'
import { fetchExercises } from '../../../services/exerciseService'

/**
 * Form for creating new support tickets
 */
const TicketForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticket_type: 'other',
    related_lesson: '',
    related_exercise: '',
  })
  const [lessons, setLessons] = useState([])
  const [exercises, setExercises] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch lessons and exercises when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // These should be adjusted to match your actual API services
        const lessonsData = await fetchLessons()
        const exercisesData = await fetchExercises()

        setLessons(lessonsData)
        setExercises(exercisesData)
      } catch (error) {
        console.error('Error fetching lessons or exercises:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    let updatedData = {
      ...formData,
      [name]: value,
    }

    // Clear the other related field when changing ticket type
    if (name === 'ticket_type') {
      if (value === 'lesson') {
        updatedData.related_exercise = ''
      } else if (value === 'exercise') {
        updatedData.related_lesson = ''
      } else {
        // If "other" is selected, clear both related fields
        updatedData.related_lesson = ''
        updatedData.related_exercise = ''
      }
    }

    setFormData(updatedData)

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const createdTicket = await ticketService.createTicket(formData)
      console.info('cricket creation succesfull')
      navigate(`/support/tickets`, {
        state: { message: 'Ticket created successfully!' },
      })
    } catch (err) {
      console.error('Error creating ticket:', err)
      setSubmitError('Failed to create ticket. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Create Support Ticket" />
      <CardContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Brief summary of your issue"
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="ticket-type-label">Type</InputLabel>
            <Select
              labelId="ticket-type-label"
              name="ticket_type"
              value={formData.ticket_type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="lesson">Lesson Issue</MenuItem>
              <MenuItem value="exercise">Exercise Issue</MenuItem>
              <MenuItem value="other">Other Issue</MenuItem>
            </Select>
          </FormControl>

          {formData.ticket_type === 'lesson' && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="related-lesson-label">Related Lesson</InputLabel>
              <Select
                labelId="related-lesson-label"
                name="related_lesson"
                value={formData.related_lesson}
                onChange={handleChange}
                label="Related Lesson"
                disabled={isLoading}
              >
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.title || lesson.name}
                  </MenuItem>
                ))}
                {isLoading && <MenuItem disabled>Loading lessons...</MenuItem>}
              </Select>
            </FormControl>
          )}

          {formData.ticket_type === 'exercise' && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="related-exercise-label">Related Exercise</InputLabel>
              <Select
                labelId="related-exercise-label"
                name="related_exercise"
                value={formData.related_exercise}
                onChange={handleChange}
                label="Related Exercise"
                disabled={isLoading}
              >
                {exercises.map((exercise) => (
                  <MenuItem key={exercise.id} value={exercise.id}>
                    {exercise.title || exercise.name}
                  </MenuItem>
                ))}
                {isLoading && <MenuItem disabled>Loading exercises...</MenuItem>}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={
              errors.description
                ? errors.description
                : 'You can use Markdown for formatting your description.'
            }
            placeholder="Detailed description of your issue (Markdown supported)"
            multiline
            rows={6}
            margin="normal"
          />

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/support/tickets')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TicketForm
