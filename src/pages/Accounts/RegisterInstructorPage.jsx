import React from 'react'
import RegistrationForm from '../../components/accounts/RegistrationForm'
import Container from '@mui/material/Container'

const RegisterInstructorPage = () => {
  return (
    <>
      <Container maxWidth="sm">
        <RegistrationForm registrationType="instructor" />
      </Container>
    </>
  )
}

export default RegisterInstructorPage
