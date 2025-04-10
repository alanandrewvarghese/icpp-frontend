import React from 'react'
import { Paper, Box, Typography, Chip } from '@mui/material'
import ReactMarkdown from 'react-markdown'

/**
 * Component to display a single response in a ticket thread
 */
const TicketResponseItem = ({ response }) => {
  const { user, message, created_at, is_admin_response } = response

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        maxWidth: '95%',
        marginLeft: is_admin_response ? 'auto' : '0',
        borderLeft: is_admin_response ? '4px solid #1976d2' : 'none',
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: is_admin_response ? 'primary.light' : 'grey.100',
          color: is_admin_response ? 'primary.contrastText' : 'text.primary',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              {user?.username || 'Unknown User'}
            </Typography>
            {is_admin_response && (
              <Chip label="Staff" size="small" color="warning" sx={{ ml: 1 }} />
            )}
          </Box>
          <Typography variant="body2">{formatDate(created_at)}</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <ReactMarkdown>{message}</ReactMarkdown>
      </Box>
    </Paper>
  )
}

export default TicketResponseItem
