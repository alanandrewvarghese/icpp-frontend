import React from 'react'
import UserList from '../../components/admin/UserList'
import { Container, Typography, Box, Divider } from '@mui/material'
import MarginTop from '../../components/layout/MarginTop'
import AuthCheck from '../../components/AuthCheck'
import { useLocation } from 'react-router-dom'

const UserManagementPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // Extract filter parameters from URL
  const typeFilter = queryParams.get('type') || 'all'
  const statusFilter = queryParams.get('status') || 'all'

  return (
    <AuthCheck allowedRoles={['admin']}>
      <Container maxWidth="lg">
        <MarginTop mt="90px" />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage users and approve instructor registrations.
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>
        <UserList initialTypeFilter={typeFilter} initialStatusFilter={statusFilter} />
      </Container>
      <MarginTop mt="40px" />
    </AuthCheck>
  )
}

export default UserManagementPage
