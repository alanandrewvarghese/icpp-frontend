import React from 'react'
import { Chip } from '@mui/material'

/**
 * Displays a colored badge for ticket status
 */
const TicketStatusBadge = ({ status }) => {
  // Map status to MUI color props
  const getStatusColor = () => {
    switch (status) {
      case 'open':
        return 'error'
      case 'resolved':
        return 'success'
      default:
        return 'default'
    }
  }

  // Format the status text (capitalize first letter)
  const formatStatus = (status) => {
    if (!status) return ''
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return <Chip label={formatStatus(status)} color={getStatusColor()} size="small" sx={{ mr: 1 }} />
}

export default TicketStatusBadge
