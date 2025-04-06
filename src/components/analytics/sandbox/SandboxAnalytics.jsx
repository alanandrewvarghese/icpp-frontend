import React from 'react'
import { Box, Grid } from '@mui/material'
import SandboxAnalyticsOverview from './SandboxAnalyticsOverview'
import LanguageDistributionChart from './LanguageDistributionChart'
import ErrorTypesTable from '../../common/ErrorTypesTable'

const SandboxAnalytics = ({ data }) => {
  return (
    <Box>
      <SandboxAnalyticsOverview data={data} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LanguageDistributionChart data={data.language_distribution} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ErrorTypesTable
            title="Common Error Types"
            errors={data.common_error_types}
            emptyMessage="No error data available"
          />
        </Grid>
      </Grid>

      {/* We can add an execution trend chart component here later */}
    </Box>
  )
}

export default SandboxAnalytics
