import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { confirmPasswordReset } from '../../services/authService' // Import the auth service
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
  Fade,
} from '@mui/material'
import {
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// Add styled component for error messages, matching RegistrationForm
const ErrorMessage = styled(Fade)(({ theme }) => ({
  '& span': {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
  },
}))

const ResetPasswordConfirmForm = () => {
  const { uidb64, token } = useParams() // Extract uidb64 and token from URL
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('') // For server/API errors
  const [passwordError, setPasswordError] = useState('') // For password field validation
  const [confirmPasswordError, setConfirmPasswordError] = useState('') // For confirm password field validation
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Add password validator function, matching RegistrationForm
  const validatePassword = (password) => {
    // Require minimum 8 chars with at least one lowercase, one uppercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  // Add validation on change handler for password
  const handlePasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)
    if (value && !validatePassword(value)) {
      setPasswordError(
        'Password must be at least 8 characters with at least one lowercase letter, one uppercase letter, and one number',
      )
    } else {
      setPasswordError('')
    }
  }

  // Add validation on change handler for confirm password
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmNewPassword(value)
    if (newPassword && value && newPassword !== value) {
      setConfirmPasswordError('Passwords do not match')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setSuccessMessage('')
    setLoading(true)

    if (!newPassword || !confirmNewPassword) {
      setPasswordError(!newPassword ? 'Please enter your new password.' : '')
      setConfirmPasswordError(!confirmNewPassword ? 'Please confirm your new password.' : '')
      setLoading(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (!validatePassword(newPassword)) {
      setPasswordError(
        'Password must be at least 8 characters with at least one lowercase letter, one uppercase letter, and one number',
      )
      setLoading(false)
      return
    }

    // Use the authService function instead of direct apiClient call
    const result = await confirmPasswordReset(uidb64, token, newPassword, confirmNewPassword)

    if (result.success) {
      setSuccessMessage('Password reset successful. You can now login with your new password.')
      // Optionally redirect to login page after successful reset
      setTimeout(() => {
        navigate('/login', { state: { passwordResetSuccess: true } })
      }, 3000) // Redirect after 3 seconds
    } else {
      setApiError(result.error || 'Password reset failed. Please try again.')
    }

    setLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
    >
      <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 500 }}>
          Reset Your Password
        </Typography>

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
              id="newPassword"
              label="New Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={handlePasswordChange}
              required
              error={!!passwordError}
              helperText={
                <ErrorMessage in={!!passwordError} timeout={300}>
                  <span>{passwordError}</span>
                </ErrorMessage>
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              id="confirmNewPassword"
              label="Confirm New Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={handleConfirmPasswordChange}
              required
              error={!!confirmPasswordError}
              helperText={
                <ErrorMessage in={!!confirmPasswordError} timeout={300}>
                  <span>{confirmPasswordError}</span>
                </ErrorMessage>
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
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
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default ResetPasswordConfirmForm
