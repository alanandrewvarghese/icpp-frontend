import React from 'react'
import PasswordChangeForm from '../../components/accounts/PasswordChangeForm'
import Container from '@mui/material/Container'
import MarginTop from '../../components/layout/MarginTop'

const PasswordChangePage = () => {
  return (
    <>
      <Container maxWidth="sm">
        <MarginTop />
        <PasswordChangeForm />
      </Container>
    </>
  )
}

export default PasswordChangePage
