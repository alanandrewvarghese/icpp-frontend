import React from 'react'
import { Paper, Typography, Box, Icon } from '@mui/material'

const StatsCard = ({ title, value, icon, color = 'primary.main' }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 2,
      }}
    >
      <Icon sx={{ fontSize: 55, color, mb: 1 }}>{icon}</Icon>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  )
}

export default StatsCard
