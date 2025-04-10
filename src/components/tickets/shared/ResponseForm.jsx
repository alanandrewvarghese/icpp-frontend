import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'
import ticketService from '../../../services/ticketService'

/**
 * Form component for adding responses to tickets
 */
const ResponseForm = ({ ticketId, onResponseAdded }) => {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const updatedTicket = await ticketService.addResponse(ticketId, message)
      setMessage('')
      if (onResponseAdded) {
        onResponseAdded(updatedTicket)
      }
    } catch (err) {
      setError('Failed to add response. Please try again.')
      console.error('Error adding response:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Response
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Type your response here... (Markdown supported)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          sx={{ mb: 2 }}
          helperText="You can use Markdown for formatting your response."
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting || !message.trim()}
        >
          {isSubmitting ? 'Sending...' : 'Submit Response'}
        </Button>
      </Box>
    </Box>
  )
}

export default ResponseForm
