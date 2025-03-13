import React from 'react'
import ForgotPasswordForm from '../../components/accounts/ForgotPasswordForm'
import Container from '@mui/material/Container'
import MarginTop from '../../components/layout/MarginTop'

const ForgotPasswordPage = () => {
  return (
    <>
      <Container maxWidth="sm">
        <ForgotPasswordForm />
      </Container>
    </>
  )
}

export default ForgotPasswordPage
