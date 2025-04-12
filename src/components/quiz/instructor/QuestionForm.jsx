import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Radio,
  FormControlLabel,
  Paper,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import quizService from '../../../services/quizService'
import { useContext } from 'react'
import { AuthContext } from '../../../contexts/AuthContext' // Import the AuthContext

const QuestionForm = ({ quizId, question = null, onSave, onCancel }) => {
  const isEditing = !!question
  const { user: currentUser } = useContext(AuthContext) // Get current user from context

  const [formData, setFormData] = useState({
    text: question ? question.text : '',
    order: question ? question.order : 1,
    quiz: quizId,
    choices:
      question && question.choices
        ? question.choices
        : [
            { text: '', is_correct: true },
            { text: '', is_correct: false },
          ],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleQuestionChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'order' ? parseInt(value, 10) : value,
    })
  }

  const handleChoiceChange = (index, field, value) => {
    const updatedChoices = [...formData.choices]
    updatedChoices[index] = {
      ...updatedChoices[index],
      [field]: field === 'is_correct' ? value : value,
    }
    setFormData({
      ...formData,
      choices: updatedChoices,
    })
  }

  const handleAddChoice = () => {
    setFormData({
      ...formData,
      choices: [...formData.choices, { text: '', is_correct: false }],
    })
  }

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...formData.choices]
    updatedChoices.splice(index, 1)

    // Ensure at least one choice is correct
    const hasCorrectChoice = updatedChoices.some((choice) => choice.is_correct)
    if (!hasCorrectChoice && updatedChoices.length > 0) {
      updatedChoices[0].is_correct = true
    }

    setFormData({
      ...formData,
      choices: updatedChoices,
    })
  }

  const handleCorrectAnswerChange = (index) => {
    const updatedChoices = formData.choices.map((choice, i) => ({
      ...choice,
      is_correct: i === index,
    }))

    setFormData({
      ...formData,
      choices: updatedChoices,
    })
  }

  const validateForm = () => {
    // Check if question text is provided
    if (!formData.text.trim()) {
      setError('Please enter a question')
      return false
    }

    // Check if all choices have text
    const emptyChoices = formData.choices.some((choice) => !choice.text.trim())
    if (emptyChoices) {
      setError('All answer choices must have text')
      return false
    }

    // Ensure there's a correct answer
    const hasCorrectAnswer = formData.choices.some((choice) => choice.is_correct)
    if (!hasCorrectAnswer) {
      setError('Please mark one answer as correct')
      return false
    }

    return true
  }

  // Before submitting, verify quiz access
  const verifyQuizAccess = async () => {
    try {
      const quizDetails = await quizService.getQuiz(quizId)

      console.log('Quiz details:', quizDetails)
      console.log('Quiz creator username:', quizDetails.created_by_username)
      console.log('Quiz creator ID:', quizDetails.created_by)
      console.log('Current user:', currentUser)

      // Remove this verification since the backend already handles permissions
      // Just log information for debugging
      return true
    } catch (error) {
      console.error('Error verifying quiz access:', error)
      setError(`Error accessing quiz: ${error.message}`)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      setError(null)
      let savedQuestion

      // First save the question
      if (isEditing && question && question.id) {
        // Only update if we're in edit mode AND have a valid question ID
        console.log('Updating question with ID:', question.id)
        console.log('Update payload:', {
          text: formData.text,
          order: formData.order,
          quiz: quizId,
        })

        try {
          savedQuestion = await quizService.updateQuestion(question.id, {
            text: formData.text,
            order: formData.order,
            quiz: quizId,
          })
        } catch (updateError) {
          console.error('Error response from update:', updateError.response?.data)
          throw updateError // Re-throw to be caught by outer catch
        }
      } else {
        // Create a new question
        console.log('Creating new question with payload:', {
          text: formData.text,
          order: formData.order,
          quiz: quizId,
        })

        savedQuestion = await quizService.createQuestion({
          text: formData.text,
          order: formData.order,
          quiz: quizId,
        })
      }

      console.log('Question saved successfully:', savedQuestion)

      // Then handle the choices
      const choicePromises = formData.choices.map(async (choice) => {
        // Ensure we have a valid saved question ID
        if (!savedQuestion || !savedQuestion.id) {
          throw new Error('Failed to get question ID for choices')
        }

        if (choice.id) {
          // Update existing choice
          console.log('Updating choice:', choice.id)
          return quizService.updateChoice(choice.id, {
            text: choice.text,
            is_correct: choice.is_correct,
            question: savedQuestion.id,
          })
        } else {
          // Create new choice
          console.log('Creating new choice for question:', savedQuestion.id)
          return quizService.createChoice({
            text: choice.text,
            is_correct: choice.is_correct,
            question: savedQuestion.id,
          })
        }
      })

      const savedChoices = await Promise.all(choicePromises)
      console.log('All choices saved:', savedChoices)

      onSave(savedQuestion)
    } catch (error) {
      console.error('Error saving question:', error)
      setError(
        `Failed to save question: ${error.response?.data?.error || error.message || 'Please try again.'}`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 3 }} variant="outlined">
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? 'Edit Question' : 'Add New Question'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Question Text"
          name="text"
          value={formData.text}
          onChange={handleQuestionChange}
          required
          fullWidth
          multiline
          rows={3}
          margin="normal"
          placeholder="Enter your question here..."
        />

        <TextField
          label="Display Order"
          name="order"
          type="number"
          value={formData.order}
          onChange={handleQuestionChange}
          required
          InputProps={{
            inputProps: { min: 1 },
          }}
          margin="normal"
          sx={{ width: '120px' }}
        />

        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Answer Choices
          </Typography>
          <Divider />
        </Box>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {formData.choices.map((choice, index) => (
            <Card key={index} variant="outlined" sx={{ position: 'relative' }}>
              <CardContent sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={choice.is_correct}
                        onChange={() => handleCorrectAnswerChange(index)}
                        name={`correctAnswer-${index}`}
                        color="success"
                      />
                    }
                    label="Correct"
                    sx={{ width: '100px' }}
                  />
                  <TextField
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                    placeholder="Enter answer choice..."
                    required
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: formData.choices.length > 2 && (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveChoice(index)}
                            color="error"
                            size="small"
                            title="Remove choice"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Button
          type="button"
          onClick={handleAddChoice}
          startIcon={<AddCircleOutlineIcon />}
          variant="outlined"
          sx={{ mb: 4 }}
        >
          Add Another Choice
        </Button>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Saving...' : 'Save Question'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default QuestionForm
