import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { useQuiz, QUIZ_ACTIONS } from '../context/QuizContext'
import quizService from '../../../services/quizService'
import { fetchLessons } from '../../../services/lessonService'

const QuizForm = ({ quizId = null, lessonId = null, onSave }) => {
  const { dispatch } = useQuiz()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    passing_score: 70,
    lesson: lessonId || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [lessonError, setLessonError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  // Fetch available lessons for the dropdown
  useEffect(() => {
    const getLessons = async () => {
      try {
        setLoadingLessons(true)
        setLessonError(null)
        const lessonsData = await fetchLessons()
        setLessons(lessonsData)
      } catch (error) {
        console.error('Error fetching lessons:', error)
        setLessonError('Failed to load lessons. Please try again later.')
      } finally {
        setLoadingLessons(false)
      }
    }

    getLessons()
  }, [])

  // If editing an existing quiz, load its data
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!quizId) return

      try {
        setLoading(true)
        const quizData = await quizService.getQuiz(quizId)
        setFormData({
          title: quizData.title,
          description: quizData.description,
          passing_score: quizData.passing_score,
          lesson: quizData.lesson || '',
        })
        setError(null)
      } catch (error) {
        console.error('Error fetching quiz data:', error)
        setError(`Failed to load quiz: ${error.message || 'Unknown error'}`)
        dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: error.message })
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
  }, [quizId, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target

    // For passing score, validate the input
    if (name === 'passing_score') {
      const numValue = parseInt(value, 10) || 0

      // Clear previous error for this field
      setFormErrors((prev) => ({ ...prev, passing_score: null }))

      // Validate the passing score
      if (numValue < 1 || numValue > 100) {
        setFormErrors((prev) => ({
          ...prev,
          passing_score: 'Passing score must be between 1 and 100',
        }))
      }

      setFormData({
        ...formData,
        [name]: numValue,
      })
    } else if (name === 'title') {
      // Clear previous error for title field
      setFormErrors((prev) => ({ ...prev, title: null }))

      // Validate title
      if (!value.trim()) {
        setFormErrors((prev) => ({
          ...prev,
          title: 'Quiz title is required',
        }))
      }

      setFormData({
        ...formData,
        [name]: value,
      })
    } else if (name === 'lesson') {
      // Clear previous error for lesson field
      setFormErrors((prev) => ({ ...prev, lesson: null }))

      setFormData({
        ...formData,
        [name]: value,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Enhanced form validation
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = 'Quiz title is required'
    }

    if (!quizId && !formData.lesson && !lessonId) {
      errors.lesson = 'Please select a lesson for this quiz'
    }

    if (formData.passing_score < 1 || formData.passing_score > 100) {
      errors.passing_score = 'Passing score must be between 1 and 100'
    }

    // If there are any errors, display them and stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setError('Please correct the errors before submitting')
      return
    }

    try {
      setLoading(true)
      setError(null)
      let result

      if (quizId) {
        const updateData = {
          title: formData.title,
          description: formData.description,
          passing_score: formData.passing_score,
          lesson: formData.lesson,
        }

        console.log('Sending update with data:', updateData)
        result = await quizService.updateQuiz(quizId, updateData)
      } else if (lessonId) {
        // Create quiz for specific lesson (using pre-determined lessonId)
        const dataWithLesson = { ...formData, lesson: lessonId }
        result = await quizService.createQuizForLesson(lessonId, dataWithLesson)
      } else {
        // Create quiz for selected lesson
        result = await quizService.createQuizForLesson(formData.lesson, formData)
      }

      dispatch({
        type: QUIZ_ACTIONS.SET_CURRENT_QUIZ,
        payload: result,
      })

      // Call the onSave callback if provided
      if (onSave) {
        onSave(result)
      }
    } catch (error) {
      console.error('Error saving quiz:', error)

      // More detailed error message if available
      if (error.response?.data) {
        const errorDetails =
          typeof error.response.data === 'object'
            ? Object.entries(error.response.data)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join('; ')
            : error.response.data

        setError(`Failed to save quiz: ${errorDetails}`)
      } else {
        setError(`Failed to save quiz: ${error.message || 'Unknown error'}`)
      }

      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        {quizId ? 'Edit Quiz' : 'Create New Quiz'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Quiz Title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
          autoFocus
          inputProps={{ maxLength: 200 }}
          error={Boolean(formErrors.title)}
          helperText={formErrors.title}
        />

        <TextField
          fullWidth
          label="Description"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          inputProps={{ maxLength: 1000 }}
        />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
          <TextField
            label="Passing Score"
            id="passing_score"
            name="passing_score"
            type="number"
            value={formData.passing_score}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            inputProps={{
              min: 1,
              max: 100,
            }}
            sx={{ width: { xs: '100%', sm: '200px' } }}
            error={Boolean(formErrors.passing_score)}
            helperText={formErrors.passing_score}
          />

          <FormControl
            fullWidth
            margin="normal"
            disabled={Boolean(quizId) || Boolean(lessonId) || loadingLessons}
            required
            error={Boolean(formErrors.lesson) || (!formData.lesson && !lessonId && !quizId)}
          >
            <InputLabel id="lesson-select-label">Lesson *</InputLabel>
            <Select
              labelId="lesson-select-label"
              id="lesson"
              name="lesson"
              value={formData.lesson}
              onChange={handleChange}
              label="Lesson *"
            >
              {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </MenuItem>
              ))}
            </Select>
            {loadingLessons && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Loading lessons...
                </Typography>
              </Box>
            )}
            {lessonError && <FormHelperText error>{lessonError}</FormHelperText>}
            {!formData.lesson && !lessonId && !quizId && !loadingLessons && !lessonError && (
              <FormHelperText>Please select a lesson for this quiz</FormHelperText>
            )}
            {(lessonId || quizId) && (
              <FormHelperText>
                {quizId
                  ? "Lesson can't be changed after quiz creation"
                  : 'This quiz is assigned to the current lesson'}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || (!formData.lesson && !lessonId && !quizId && !loadingLessons)}
          >
            {loading ? 'Saving...' : quizId ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default QuizForm
