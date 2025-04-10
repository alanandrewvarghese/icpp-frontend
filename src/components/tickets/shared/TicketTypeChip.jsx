import React from 'react'
import { Chip } from '@mui/material'

/**
 * Displays a colored chip for ticket type
 */
const TicketTypeChip = ({ type }) => {
  // Map type to MUI color props
  const getTypeColor = () => {
    switch (type) {
      case 'lesson':
        return 'primary'
      case 'exercise':
        return 'info'
      case 'other':
      default:
        return 'default'
    }
  }

  // Format the type text (capitalize first letter)
  const formatType = (type) => {
    if (!type) return ''
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <Chip
      label={formatType(type)}
      color={getTypeColor()}
      size="small"
      variant="outlined"
      sx={{ mr: 1 }}
    />
  )
}

export default TicketTypeChip
