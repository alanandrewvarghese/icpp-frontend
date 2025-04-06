import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material'
import { getUserBadges } from '../../services/progressService'
import Badge from '../../components/progress/Badge'
import MarginTop from '../../components/layout/MarginTop'

const BadgesPage = () => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true)
        const userBadges = await getUserBadges()
        setBadges(userBadges)
      } catch (err) {
        console.error('Failed to fetch badges:', err)
        setError('Failed to load your badges. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [])

  // Group badges by category
  const groupedBadges = badges.reduce((acc, badge) => {
    const category = badge.badge.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(badge)
    return acc
  }, {})

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <MarginTop mt="90px"></MarginTop>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          Badges are awarded for completing various achievements within the platform. Collect them
          by completing exercises, participating in discussions, and mastering Python concepts!
        </Typography>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : badges.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          You haven't earned any badges yet. Complete exercises and challenges to earn your first
          badge!
        </Alert>
      ) : (
        Object.entries(groupedBadges).map(([category, categoryBadges]) => (
          <Box key={category} mb={4}>
            <Typography variant="h5" sx={{ mb: 2, mt: 4, textTransform: 'capitalize' }}>
              {category} Badges
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {categoryBadges.map((badge) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={badge.id}>
                  <Badge badge={badge} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
    </Container>
  )
}

export default BadgesPage
