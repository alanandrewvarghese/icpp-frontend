import React from 'react'
import { Container } from '@mui/material'
import AdminTicketDetail from '../../../components/tickets/admin/AdminTicketDetail'
import MarginTop from '../../../components/layout/MarginTop'

const AdminTicketDetailPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <MarginTop mt="90px"></MarginTop>
      <AdminTicketDetail />
    </Container>
  )
}

export default AdminTicketDetailPage
