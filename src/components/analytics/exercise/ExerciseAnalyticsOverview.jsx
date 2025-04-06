import React from 'react'
import { Grid, Typography, Box, Divider } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import PercentIcon from '@mui/icons-material/Percent'
import StatsCard from '../../common/StatsCard'

const ExerciseAnalyticsOverview = ({ data }) => {
  const { overall_stats } = data

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Exercise Analytics Overview
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Submissions"
            value={overall_stats.total_submissions}
            icon={<UploadFileIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Correct Submissions"
            value={overall_stats.correct_submissions}
            icon={<CheckCircleIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Incorrect Submissions"
            value={overall_stats.incorrect_submissions}
            icon={<ErrorIcon />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Success Rate"
            value={`${overall_stats.success_rate.toFixed(1)}%`}
            icon={<PercentIcon />}
            color="info.main"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ExerciseAnalyticsOverview
