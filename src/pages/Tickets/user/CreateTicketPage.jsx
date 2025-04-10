import React from 'react'
import { Container } from '@mui/material'
import TicketForm from '../../../components/tickets/user/TicketForm'
import MarginTop from '../../../components/layout/MarginTop'

const CreateTicketPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <MarginTop mt="90px"></MarginTop>

      <TicketForm />
    </Container>
  )
}

export default CreateTicketPage
