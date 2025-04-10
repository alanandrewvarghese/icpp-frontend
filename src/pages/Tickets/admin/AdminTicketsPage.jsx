import React from 'react'
import { Container } from '@mui/material'
import AdminTicketList from '../../../components/tickets/admin/AdminTicketList'
import MarginTop from '../../../components/layout/MarginTop'

const AdminTicketsPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <MarginTop mt="90px"></MarginTop>

      <AdminTicketList />
    </Container>
  )
}

export default AdminTicketsPage
