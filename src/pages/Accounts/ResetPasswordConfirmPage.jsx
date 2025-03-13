import React from 'react'
import ResetPasswordConfirmForm from '../../components/accounts/ResetPasswordConfirmForm'
import Container from '@mui/material/Container'
import MarginTop from '../../components/layout/MarginTop'

const ResetPasswordConfirmPage = () => {
  return (
    <>
      <Container maxWidth="sm">
        <ResetPasswordConfirmForm />
      </Container>
    </>
  )
}

export default ResetPasswordConfirmPage
