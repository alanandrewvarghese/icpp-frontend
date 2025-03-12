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
} from '@mui/material'
import {
  PersonOutline as PersonOutlineIcon,
  EmailOutlined as EmailOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const RegistrationForm = ({ registrationType = 'student' }) => {
  // Added registrationType prop
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { registerStudentContext, registerInstructorContext } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
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
      } else if (registrationType === 'instructor') {
        response = await registerInstructorContext(username, password, email)
      }

      if (response && response.message) {
        // Assuming backend sends { message: "..." } on success
        // Redirect to login page or homepage with a success message
        console.log('Registration successful', response.message)
        navigate('/login', { state: { registrationSuccess: true } }) // Navigate to login with success state
      } else if (response && response.error) {
        setError(response.error) // Display backend error message
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Registration failed. Please try again later.')
    }
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

        <Collapse in={!!error}>
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
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              fullWidth
              id="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              error={error && !username}
              helperText={error && !username ? 'Username is required' : ''}
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
              onChange={(e) => setEmail(e.target.value)}
              required
              error={error && !email}
              helperText={error && !email ? 'Email is required' : ''}
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
              onChange={(e) => setPassword(e.target.value)}
              required
              error={error && !password}
              helperText={error && !password ? 'Password is required' : ''}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={error && password !== confirmPassword}
              helperText={error && password !== confirmPassword ? 'Passwords must match' : ''}
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
                Registering as {formTitle} ? Need to register as{' '}
                <Link href={registerAsLink} underline="hover">
                  {registerAsText}
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default RegistrationForm
