import React from 'react'
import { Typography, Box, Divider, Paper } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Predefined colors for the chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B']

const LanguageDistributionChart = ({ data }) => {
  // If no data is available
  if (!data || data.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Language Distribution
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No language data available</Typography>
        </Paper>
      </Box>
    )
  }

  // Format the data for the pie chart
  const chartData = data.map((item, index) => ({
    name: item.language,
    value: item.count,
  }))

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Language Distribution
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Paper variant="outlined" sx={{ p: 2, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} executions`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  )
}

export default LanguageDistributionChart
