import React, { useState } from 'react'
import { Box, Card, CardContent, CardMedia, Typography, Tooltip } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'

const Badge = ({ badge }) => {
  const [imageError, setImageError] = useState(false)

  // Extract badge data
  const { badge: badgeDetails, earned_at } = badge
  const { name, description, icon, category } = badgeDetails

  // Format the date (how long ago the badge was earned)
  const earnedTimeAgo = formatDistanceToNow(new Date(earned_at), { addSuffix: true })

  // In Vite, we use import.meta.env instead of process.env
  const apiUrl = import.meta.env.VITE_API_URL || ''
  const iconUrl = `${apiUrl}/assets/images/badges/${icon}`
  console.info(iconUrl)
  const fallbackIconUrl = '/assets/images/badges/starter.png'

  return (
    <Tooltip title={`Earned ${earnedTimeAgo}`} arrow>
      <Card
        sx={{
          maxWidth: 200,
          m: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 3,
          },
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={imageError ? fallbackIconUrl : iconUrl}
          alt={name}
          onError={() => setImageError(true)}
          sx={{
            objectFit: 'contain',
            p: 2,
            bgcolor: category === 'achievement' ? '#e3f2fd' : '#fff8e1',
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" align="center">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Box mt={1}>
            <Typography variant="caption" color="text.secondary">
              Category: {category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Tooltip>
  )
}

export default Badge
