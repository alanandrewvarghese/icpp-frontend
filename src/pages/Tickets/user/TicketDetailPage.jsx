import React from 'react'
import { Container } from '@mui/material'
import TicketDetail from '../../../components/tickets/user/TicketDetail'
import MarginTop from '../../../components/layout/MarginTop'

const TicketDetailPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <MarginTop mt="90px"></MarginTop>

      <TicketDetail />
    </Container>
  )
}

export default TicketDetailPage
