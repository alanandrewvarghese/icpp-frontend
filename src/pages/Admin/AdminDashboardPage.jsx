import React from 'react'
import AdminDashboard from '../../components/admin/AdminDashboard'
import { Container, Typography, Box, Divider, Paper } from '@mui/material'
import MarginTop from '../../components/layout/MarginTop'
import AuthCheck from '../../components/AuthCheck'

const AdminDashboardPage = () => {
  return (
    <AuthCheck allowedRoles={['admin']}>
      <Container maxWidth="lg">
        <MarginTop mt="90px" />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage the platform and monitor key statistics.
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>

        <Paper sx={{ my: 4, p: 3 }}>
          <AdminDashboard />
        </Paper>
      </Container>
    </AuthCheck>
  )
}

export default AdminDashboardPage
