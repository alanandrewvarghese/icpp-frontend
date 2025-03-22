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
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import EscapeCharacterProcessor from '../common/EscapeCharacterProcessor'
import { createExercise, updateExercise, fetchExercise } from '../../services/exerciseService'
import { fetchLessons } from '../../services/lessonService'

const ExerciseForm = ({
  isEditMode = false,
  initialExerciseData = null,
  loadingExercise: propLoadingExercise,
}) => {
  const navigate = useNavigate()
  const { exerciseId } = useParams()

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [starterCode, setStarterCode] = useState('# Write your code here\n')
  const [lessonId, setLessonId] = useState('')
  const [testCases, setTestCases] = useState([{ input: '', expected_output: '' }])

  // UI state
  const [loading, setLoading] = useState(false)
  const [loadingExercise, setLoadingExercise] = useState(
    isEditMode && propLoadingExercise !== false,
  )
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [lessons, setLessons] = useState([])

  // Validation
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    lesson: '',
    testCases: '',
  })

  // Load available lessons
  useEffect(() => {
    const getLessons = async () => {
      try {
        const lessonsData = await fetchLessons()
        setLessons(lessonsData || [])
      } catch (err) {
        console.error('Failed to load lessons:', err)
        setError('Failed to load lessons. Please try again later.')
      }
    }

    getLessons()
  }, [])

  // Load exercise data if in edit mode
  useEffect(() => {
    // If loadingExercise is explicitly set to false via props, respect that
    if (propLoadingExercise === false) {
      setLoadingExercise(false)
    }

    if (isEditMode) {
      if (initialExerciseData) {
        // Use the provided data directly
        setTitle(initialExerciseData.title || '')
        setDescription(initialExerciseData.description || '')
        setStarterCode(initialExerciseData.starter_code || '# Write your code here\n')
        setLessonId(initialExerciseData.lesson || '')

        // Load test cases or initialize with empty one
        if (initialExerciseData.test_cases && initialExerciseData.test_cases.length > 0) {
          setTestCases(initialExerciseData.test_cases)
        }

        // Important: Set loading to false when initial data is provided
        setLoadingExercise(false)
      } else if (exerciseId) {
        // Fall back to fetching data if not provided
        const loadExercise = async () => {
          try {
            setLoadingExercise(true)
            const exercise = await fetchExercise(exerciseId)

            setTitle(exercise.title || '')
            setDescription(exercise.description || '')
            setStarterCode(exercise.starter_code || '# Write your code here\n')
            setLessonId(exercise.lesson || '')

            // Load test cases or initialize with empty one
            if (exercise.test_cases && exercise.test_cases.length > 0) {
              setTestCases(exercise.test_cases)
            }
          } catch (err) {
            console.error('Failed to load exercise:', err)
            setError('Failed to load exercise data. Please try again later.')
          } finally {
            setLoadingExercise(false)
          }
        }

        loadExercise()
      }
    }
  }, [isEditMode, exerciseId, initialExerciseData, propLoadingExercise])

  // Handle test case changes
  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[index][field] = value
    setTestCases(updatedTestCases)

    // Clear validation errors when user edits
    if (errors.testCases) {
      setErrors((prev) => ({ ...prev, testCases: '' }))
    }
  }

  // Add a new test case
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expected_output: '' }])
  }

  // Remove a test case
  const removeTestCase = (index) => {
    if (testCases.length > 1) {
      const updatedTestCases = testCases.filter((_, i) => i !== index)
      setTestCases(updatedTestCases)
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {
      title: !title.trim() ? 'Title is required' : '',
      description: !description.trim() ? 'Problem statement is required' : '',
      lesson: !lessonId ? 'Lesson is required' : '',
      testCases: '',
    }

    // Validate test cases
    let hasEmptyTestCase = false
    testCases.forEach((testCase) => {
      if (!testCase.expected_output.trim()) {
        hasEmptyTestCase = true
      }
    })

    if (hasEmptyTestCase) {
      newErrors.testCases = 'All test cases must have an expected output'
    }

    if (testCases.length === 0) {
      newErrors.testCases = 'At least one test case is required'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccessMessage('')

    const exerciseData = {
      title,
      description,
      starter_code: starterCode,
      lesson: lessonId,
      test_cases: testCases,
    }

    try {
      if (isEditMode) {
        await updateExercise(exerciseId, exerciseData)
        setSuccessMessage('Exercise updated successfully!')
      } else {
        await createExercise(exerciseData)
        setSuccessMessage('Exercise created successfully!')

        // Reset form after successful creation
        setTitle('')
        setDescription('')
        setStarterCode('# Write your code here\n')
        setLessonId('')
        setTestCases([{ input: '', expected_output: '' }])
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate(`/lessons/${lessonId}?tab=exercises`)
      }, 2000)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again later.')
      console.error('Exercise submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    if (isEditMode && exerciseId) {
      // Reload original data in edit mode
      const loadExercise = async () => {
        try {
          setLoadingExercise(true)
          const exercise = await fetchExercise(exerciseId)

          setTitle(exercise.title || '')
          setDescription(exercise.description || '')
          setStarterCode(exercise.starter_code || '# Write your code here\n')
          setLessonId(exercise.lesson || '')

          // Load test cases or initialize with empty one
          if (exercise.test_cases && exercise.test_cases.length > 0) {
            setTestCases(exercise.test_cases)
          } else {
            setTestCases([{ input: '', expected_output: '' }])
          }
        } catch (err) {
          console.error('Failed to reload exercise:', err)
        } finally {
          setLoadingExercise(false)
        }
      }

      loadExercise()
    } else {
      // Clear form in create mode
      setTitle('')
      setDescription('')
      setStarterCode('# Write your code here\n')
      setLessonId('')
      setTestCases([{ input: '', expected_output: '' }])
    }

    // Clear all errors
    setErrors({
      title: '',
      description: '',
      lesson: '',
      testCases: '',
    })
  }

  // Cancel form
  const handleCancel = () => {
    navigate(-1)
  }

  // Check if we should render the loading spinner
  // Only show if loadingExercise hasn't been explicitly set to false via props
  if (loadingExercise && propLoadingExercise !== false) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 0.5 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 500 }}>
        {isEditMode ? 'Edit Exercise' : 'Create New Exercise'}
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
          {/* Form content remains the same */}
          <Typography variant="h6" fontWeight="500">
            Basic Information
          </Typography>

          <TextField
            fullWidth
            id="title"
            label="Exercise Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!errors.title}
            helperText={errors.title || 'A concise, descriptive title for the exercise'}
            inputProps={{ maxLength: 100 }}
            disabled={loading}
          />

          <FormControl fullWidth error={!!errors.lesson} disabled={loading}>
            <InputLabel id="lesson-select-label">Associated Lesson</InputLabel>
            <Select
              labelId="lesson-select-label"
              id="lesson-select"
              value={lessonId}
              label="Associated Lesson"
              onChange={(e) => setLessonId(e.target.value)}
              required
            >
              {lessons.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {errors.lesson || 'Select the lesson this exercise belongs to'}
            </FormHelperText>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          {/* Problem Statement */}
          <Typography variant="h6" fontWeight="500">
            Problem Statement
          </Typography>

          <Box>
            <EscapeCharacterProcessor
              initialValue={description}
              onChange={setDescription}
              label="Problem Statement (Markdown Format)"
              rows={8}
              error={!!errors.description}
              helperText={errors.description || 'Use Markdown formatting for the problem statement'}
              disabled={loading}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Starter Code */}
          <Typography variant="h6" fontWeight="500">
            Starter Code
          </Typography>

          <Box sx={{ height: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Editor
              height="300px"
              defaultLanguage="python"
              value={starterCode}
              onChange={(value) => setStarterCode(value)}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: 'on',
              }}
            />
          </Box>
          <FormHelperText>
            Provide starter code that will be shown to students when they begin the exercise
          </FormHelperText>

          <Divider sx={{ my: 1 }} />

          {/* Test Cases */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="500">
              Test Cases
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addTestCase}
              disabled={loading}
              variant="outlined"
              size="small"
            >
              Add Test Case
            </Button>
          </Box>

          {errors.testCases && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.testCases}
            </Alert>
          )}

          {testCases.map((testCase, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="500">
                      Test Case #{index + 1}
                    </Typography>
                    <Button
                      variant="text"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => removeTestCase(index)}
                      disabled={loading || testCases.length <= 1}
                      size="small"
                    >
                      Remove
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Input"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    disabled={loading}
                    placeholder="Enter input for this test case (optional)"
                    helperText="Input that will be provided to the program"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Expected Output"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={testCase.expected_output}
                    onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                    disabled={loading}
                    error={!testCase.expected_output.trim()}
                    helperText={
                      !testCase.expected_output.trim()
                        ? 'Expected output is required'
                        : 'Expected output that student code should produce'
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>

            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={resetForm}
                disabled={loading}
                sx={{ mr: 2 }}
              >
                Reset
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Exercise' : 'Create Exercise'}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

export default ExerciseForm
