import React, { useState } from 'react'
import { requestPasswordReset } from '../../services/authService'
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Container,
  Collapse,
  Alert,
  IconButton,
  Stack,
  InputAdornment,
  CircularProgress,
  Link,
} from '@mui/material'
import { EmailOutlined as EmailOutlinedIcon, Close as CloseIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [apiError, setApiError] = useState('') // For server/API errors
  const [validationError, setValidationError] = useState('') // For form validation errors
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError('')
    setValidationError('')
    setSuccessMessage('')
    setLoading(true)

    if (!email) {
      setValidationError('Please enter your email address.')
      setLoading(false)
      return
    }

    // Add email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    // Use the authService function instead of direct apiClient call
    const result = await requestPasswordReset(email)

    if (result.success) {
      setSuccessMessage('Success! A reset link will be sent if your email is in our system.')
      setEmail('') // Clear the email field on success
    } else {
      setApiError(result.error || 'Failed to send password reset email. Please try again.')
    }

    setLoading(false)
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
    >
      <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 500 }}>
          Forgot Password
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Enter the email address associated with your account and we'll send you a link to reset
          your password. If you don't see the email in your inbox, please check your spam folder.
        </Typography>

        {/* Only show API errors in the alert, not validation errors */}
        <Collapse in={!!apiError}>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setApiError('')}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {apiError}
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
              id="email"
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!validationError}
              helperText={validationError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>

            {/* Add navigation link to login */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Remember your password?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Back to login
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default ForgotPasswordForm
