import React from 'react'
import { Grid, Typography, Box, Divider } from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import PercentIcon from '@mui/icons-material/Percent'
import TimerIcon from '@mui/icons-material/Timer'
import StatsCard from '../../common/StatsCard'

const SandboxAnalyticsOverview = ({ data }) => {
  const { overall_stats } = data

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Sandbox Analytics Overview
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Executions"
            value={overall_stats.total_executions}
            icon={<CodeIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Successful Executions"
            value={overall_stats.successful_executions}
            icon={<CheckCircleIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Failed Executions"
            value={overall_stats.failed_executions}
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

export default SandboxAnalyticsOverview
