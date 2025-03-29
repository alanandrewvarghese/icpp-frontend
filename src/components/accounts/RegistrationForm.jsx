import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Container,
  Link,
  Collapse,
  Alert,
  IconButton,
  Stack,
  InputAdornment,
  Grow,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import {
  PersonOutline as PersonOutlineIcon,
  EmailOutlined as EmailOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'

const ErrorMessage = styled(Fade)(({ theme }) => ({
  '& span': {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
  },
}))

const RegistrationForm = ({ registrationType = 'student' }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { registerStudentContext, registerInstructorContext } = useContext(AuthContext)
  const navigate = useNavigate()
  const [openSuccessModal, setOpenSuccessModal] = useState(false)

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate username (min 6 chars, lowercase letters and numbers only)
  const validateUsername = (username) => {
    const usernameRegex = /^[a-z0-9]{6,}$/
    return usernameRegex.test(username)
  }

  // Add this validator function near your other validation functions
  const validatePassword = (password) => {
    // Require minimum 8 chars with at least one lowercase, one uppercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  // Add validation on change handlers
  const handleUsernameChange = (e) => {
    const value = e.target.value
    setUsername(value)
    if (value && !validateUsername(value)) {
      setUsernameError(
        'Username must be at least 6 characters with lowercase letters and numbers only',
      )
    } else {
      setUsernameError('')
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    if (value && !validatePassword(value)) {
      setPasswordError(
        'Password must be at least 8 characters with at least one lowercase letter, one uppercase letter, and one number',
      )
    } else {
      setPasswordError('')
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    // Check all validation before submitting
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (!validateUsername(username)) {
      setUsernameError(
        'Username must be at least 6 characters with lowercase letters and numbers only',
      )
      setError('Please fix the username errors')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setError('Please fix the email errors')
      return
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters with at least one lowercase letter, one uppercase letter, and one number',
      )
      setError('Please fix the password errors')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      let response
      if (registrationType === 'student') {
        response = await registerStudentContext(username, password, email)
        if (response && response.message) {
          console.log('Registration successful', response.message)
          navigate('/login', { state: { registrationSuccess: true } })
        }
      } else if (registrationType === 'instructor') {
        response = await registerInstructorContext(username, password, email)
        if (response && response.message) {
          console.log('Instructor registration successful', response.message)
          setOpenSuccessModal(true) // Open the modal for instructors
        }
      }

      if (response && response.error) {
        setError(response.error)
      } else if (!response || (!response.message && !response.error)) {
        setError('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Registration failed. Please try again later.')
    }
  }

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false)
    navigate('/login')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const formTitle =
    registrationType === 'student' ? 'Student Registration' : 'Instructor Registration'
  const registerAsText = registrationType === 'student' ? 'Instructor' : 'Student'
  const registerAsLink =
    registrationType === 'student' ? '/register/instructor' : '/register/student'

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
    >
      <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 500 }}>
          {formTitle}
        </Typography>

        <Collapse in={!!error} timeout={500}>
          <Grow in={!!error} timeout={400}>
            <Alert
              severity="error"
              sx={{ mb: 3 }}
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
          </Grow>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              fullWidth
              id="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
              required
              error={!!usernameError || (error && !username)}
              helperText={
                <Fade in={!!usernameError || (error && !username)} timeout={300}>
                  <span>{usernameError || (error && !username ? 'Username is required' : '')}</span>
                </Fade>
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              id="email"
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              error={!!emailError || (error && !email)}
              helperText={
                <ErrorMessage in={!!emailError || (error && !email)} timeout={300}>
                  <span>{emailError || (error && !email ? 'Email is required' : '')}</span>
                </ErrorMessage>
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              id="password"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              required
              error={!!passwordError || (error && !password)}
              helperText={passwordError || (error && !password ? 'Password is required' : '')}
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
              id="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              error={error && (!confirmPassword || password !== confirmPassword)}
              helperText={
                error && !confirmPassword
                  ? 'Confirm Password is required'
                  : error && password !== confirmPassword
                    ? 'Passwords must match'
                    : ''
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
            >
              Register
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Not {formTitle.split(' ')[0]} ? Register as{' '}
                <Link href={registerAsLink} underline="hover">
                  {registerAsText}
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Success Dialog for Instructors */}
      <Dialog
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleOutlineIcon color="success" />
          {'Registration Submitted Successfully'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Awaiting admin approval. You will be notified via email once approved. You can log in
            only after approval.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessModal} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default RegistrationForm
