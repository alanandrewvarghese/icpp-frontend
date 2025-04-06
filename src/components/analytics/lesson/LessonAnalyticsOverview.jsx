import React from 'react'
import { Grid, Paper, Typography, Box, Divider } from '@mui/material'
import BookIcon from '@mui/icons-material/Book'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PercentIcon from '@mui/icons-material/Percent'
import StatsCard from '../../common/StatsCard'

const LessonAnalyticsOverview = ({ data }) => {
  const { overall_stats } = data

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lesson Analytics Overview
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Lessons"
            value={overall_stats.total_lessons}
            icon={<BookIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Students"
            value={overall_stats.total_students}
            icon={<PeopleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completions"
            value={overall_stats.total_completions}
            icon={<CheckCircleIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completion Rate"
            value={`${overall_stats.overall_completion_percentage.toFixed(1)}%`}
            icon={<PercentIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default LessonAnalyticsOverview
