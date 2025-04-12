import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Card,
  List,
  ListItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const QuizQuestionEditor = ({ questions, onAddQuestion, onUpdateQuestion, onRemoveQuestion }) => {
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    choices: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  })
  const [editIndex, setEditIndex] = useState(-1)
  const [expanded, setExpanded] = useState(false)

  const handleQuestionTextChange = (e) => {
    if (editIndex >= 0) {
      const updatedQuestion = { ...questions[editIndex], text: e.target.value }
      onUpdateQuestion(editIndex, updatedQuestion)
    } else {
      setNewQuestion({ ...newQuestion, text: e.target.value })
    }
  }

  const handleChoiceTextChange = (choiceIndex, e) => {
    if (editIndex >= 0) {
      const updatedQuestion = { ...questions[editIndex] }
      updatedQuestion.choices[choiceIndex].text = e.target.value
      onUpdateQuestion(editIndex, updatedQuestion)
    } else {
      const updatedChoices = [...newQuestion.choices]
      updatedChoices[choiceIndex].text = e.target.value
      setNewQuestion({ ...newQuestion, choices: updatedChoices })
    }
  }

  const handleChoiceCorrectChange = (choiceIndex) => {
    if (editIndex >= 0) {
      const updatedQuestion = { ...questions[editIndex] }
      // Set all choices to false first
      updatedQuestion.choices = updatedQuestion.choices.map((choice) => ({
        ...choice,
        isCorrect: false,
      }))
      // Then set the selected one to true
      updatedQuestion.choices[choiceIndex].isCorrect = true
      onUpdateQuestion(editIndex, updatedQuestion)
    } else {
      const updatedChoices = newQuestion.choices.map((choice, idx) => ({
        ...choice,
        isCorrect: idx === choiceIndex,
      }))
      setNewQuestion({ ...newQuestion, choices: updatedChoices })
    }
  }

  const addChoice = () => {
    if (editIndex >= 0) {
      const updatedQuestion = { ...questions[editIndex] }
      updatedQuestion.choices.push({ text: '', isCorrect: false })
      onUpdateQuestion(editIndex, updatedQuestion)
    } else {
      setNewQuestion({
        ...newQuestion,
        choices: [...newQuestion.choices, { text: '', isCorrect: false }],
      })
    }
  }

  const removeChoice = (choiceIndex) => {
    if (editIndex >= 0) {
      const updatedQuestion = { ...questions[editIndex] }
      if (updatedQuestion.choices.length > 2) {
        updatedQuestion.choices = updatedQuestion.choices.filter((_, i) => i !== choiceIndex)
        onUpdateQuestion(editIndex, updatedQuestion)
      }
    } else {
      if (newQuestion.choices.length > 2) {
        setNewQuestion({
          ...newQuestion,
          choices: newQuestion.choices.filter((_, i) => i !== choiceIndex),
        })
      }
    }
  }

  const handleSaveQuestion = () => {
    if (editIndex >= 0) {
      setEditIndex(-1)
      setExpanded(false)
    } else {
      onAddQuestion({ ...newQuestion })
      setNewQuestion({
        text: '',
        choices: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      })
      setExpanded(false)
    }
  }

  const startEditing = (index) => {
    setEditIndex(index)
    setExpanded(true)
  }

  const cancelEditing = () => {
    setEditIndex(-1)
    setExpanded(false)
  }

  const isQuestionValid = () => {
    const questionToValidate = editIndex >= 0 ? questions[editIndex] : newQuestion

    if (!questionToValidate.text.trim()) return false

    // Check if exactly one choice is marked as correct
    const hasCorrectChoice = questionToValidate.choices.filter((c) => c.isCorrect).length === 1

    // Check if all choices have text
    const allChoicesHaveText = questionToValidate.choices.every((c) => c.text.trim())

    return hasCorrectChoice && allChoicesHaveText
  }

  return (
    <Box>
      {/* List of existing questions */}
      {questions.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Questions ({questions.length})
          </Typography>
          <List>
            {questions.map((question, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {index + 1}. {question.text}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => startEditing(index)} size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onRemoveQuestion(index)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {question.choices.length} choices,{' '}
                  {question.choices.filter((c) => c.isCorrect).length} correct
                </Typography>
              </Card>
            ))}
          </List>
          <Divider sx={{ my: 3 }} />
        </>
      )}

      {/* Form to add or edit a question */}
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{editIndex >= 0 ? 'Edit Question' : 'Add New Question'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="form" noValidate>
            <TextField
              label="Question Text"
              fullWidth
              required
              margin="normal"
              value={editIndex >= 0 ? questions[editIndex].text : newQuestion.text}
              onChange={handleQuestionTextChange}
            />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Answer Choices (select one correct answer)
            </Typography>

            <RadioGroup>
              {(editIndex >= 0 ? questions[editIndex].choices : newQuestion.choices).map(
                (choice, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                      value={idx.toString()}
                      control={
                        <Radio
                          checked={choice.isCorrect}
                          onChange={() => handleChoiceCorrectChange(idx)}
                        />
                      }
                      label="Correct"
                      sx={{ width: 100 }}
                    />
                    <TextField
                      label={`Choice ${idx + 1}`}
                      fullWidth
                      required
                      value={choice.text}
                      onChange={(e) => handleChoiceTextChange(idx, e)}
                    />
                    <IconButton
                      onClick={() => removeChoice(idx)}
                      disabled={
                        (editIndex >= 0 ? questions[editIndex].choices : newQuestion.choices)
                          .length <= 2
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ),
              )}
            </RadioGroup>

            <Button startIcon={<AddIcon />} onClick={addChoice} variant="outlined" sx={{ mt: 1 }}>
              Add Choice
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {editIndex >= 0 && (
                <Button onClick={cancelEditing} sx={{ mr: 1 }}>
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveQuestion}
                disabled={!isQuestionValid()}
              >
                {editIndex >= 0 ? 'Update Question' : 'Add Question'}
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default QuizQuestionEditor
