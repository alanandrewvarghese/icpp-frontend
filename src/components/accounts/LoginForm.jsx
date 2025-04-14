import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Container,
  Link,
  Collapse,
  Alert,
  Stack,
} from '@mui/material'
import {
  PersonOutline as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { loginContext } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    console.log('LoginForm.jsx - handleSubmit function started')
    event.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    try {
      console.log('LoginForm.jsx - Calling loginContext with:', username, password)
      const response = await loginContext(username, password)
      console.log('LoginForm.jsx - Response from loginContext:', response)
      if (response?.access) {
        console.log('LoginForm.jsx - Login successful (token received)')
        console.log(response)
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard/')
        } else {
          navigate('/')
        }
      } else {
        setError('Invalid credentials. Please try again.')
        console.log('LoginForm.jsx - Login failed - invalid credentials')
      }
    } catch (error) {
      console.error('LoginForm.jsx - Error during authentication:', error)
      setError('Authentication failed. Please try again later.')
    }
    console.log('LoginForm.jsx - handleSubmit function finished')
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
          Account Login
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="forgot-password/" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Login
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Need an account?{' '}
                <Link href="register/student/" underline="hover">
                  Student
                </Link>{' '}
                |{' '}
                <Link href="register/instructor/" underline="hover">
                  Instructor
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginForm
