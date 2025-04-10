import React from 'react'
import { Container } from '@mui/material'
import TicketList from '../../../components/tickets/user/TicketList'
import MarginTop from '../../../components/layout/MarginTop'

const MyTicketsPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <MarginTop mt="90px"></MarginTop>

      <TicketList />
    </Container>
  )
}

export default MyTicketsPage
