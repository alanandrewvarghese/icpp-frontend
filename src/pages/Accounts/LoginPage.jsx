import React, { useState } from 'react'
import LoginForm from '../../components/accounts/LoginForm'
import Container from '@mui/material/Container'
import { useLocation } from 'react-router-dom' // Import useLocation
import { Alert, Collapse, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

const LoginPage = () => {
  const location = useLocation() // Use useLocation hook
  const registrationSuccess = location.state?.registrationSuccess // Get registrationSuccess from state
  const [successMessageVisible, setSuccessMessageVisible] = useState(registrationSuccess || false)

  return (
    <>
      <Container maxWidth="sm">
        <Collapse in={successMessageVisible}>
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setSuccessMessageVisible(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Registration successful! Please login with your credentials.
          </Alert>
        </Collapse>
        <LoginForm />
      </Container>
    </>
  )
}

export default LoginPage
