import React from 'react'
import { Box, Grid } from '@mui/material'
import LessonAnalyticsOverview from './LessonAnalyticsOverview'
import LessonCompletionTable from './LessonCompletionTable'

const LessonAnalytics = ({ data }) => {
  return (
    <Box>
      <LessonAnalyticsOverview data={data} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LessonCompletionTable
            title="Top Completed Lessons"
            lessons={data.top_completed_lessons}
            emptyMessage="No completed lessons data available"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LessonCompletionTable
            title="Lowest Completion Lessons"
            lessons={data.lowest_completion_lessons}
            emptyMessage="No completion data available"
          />
        </Grid>
      </Grid>

      {/* We can add a trend chart component here later */}
    </Box>
  )
}

export default LessonAnalytics
