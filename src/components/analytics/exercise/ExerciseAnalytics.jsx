import React from 'react'
import { Box, Grid } from '@mui/material'
import ExerciseAnalyticsOverview from './ExerciseAnalyticsOverview'
import ExerciseTable from './ExerciseTable'
import ErrorTypesTable from '../../common/ErrorTypesTable'

const ExerciseAnalytics = ({ data }) => {
  return (
    <Box>
      <ExerciseAnalyticsOverview data={data} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ExerciseTable
            title="Most Attempted Exercises"
            exercises={data.most_attempted_exercises}
            emptyMessage="No exercise attempt data available"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExerciseTable
            title="Challenging Exercises"
            exercises={data.challenging_exercises}
            emptyMessage="No challenging exercise data available"
          />
        </Grid>
      </Grid>

      <ErrorTypesTable
        title="Common Error Types"
        errors={data.common_error_types}
        emptyMessage="No error data available"
      />

      {/* We can add a submission trend chart component here later */}
    </Box>
  )
}

export default ExerciseAnalytics
