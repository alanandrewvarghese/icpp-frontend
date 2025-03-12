import React from 'react'
import RegistrationForm from '../../components/accounts/RegistrationForm'
import Container from '@mui/material/Container'

const RegisterStudentPage = () => {
  return (
    <>
      <Container maxWidth="sm">
        <RegistrationForm registrationType="student" />
      </Container>
    </>
  )
}

export default RegisterStudentPage
