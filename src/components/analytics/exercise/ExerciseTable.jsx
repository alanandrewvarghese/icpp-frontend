import React from 'react'
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
} from '@mui/material'

const ExerciseTable = ({ title, exercises, emptyMessage }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exercise</TableCell>
              <TableCell align="right">Total Attempts</TableCell>
              <TableCell align="right">Correct Attempts</TableCell>
              <TableCell align="right">Success Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell component="th" scope="row">
                    {exercise.title}
                  </TableCell>
                  <TableCell align="right">{exercise.total_attempts}</TableCell>
                  <TableCell align="right">{exercise.correct_attempts}</TableCell>
                  <TableCell align="right">{`${exercise.success_rate.toFixed(1)}%`}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {emptyMessage || 'No data available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ExerciseTable
