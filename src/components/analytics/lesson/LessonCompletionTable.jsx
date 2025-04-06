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

const LessonCompletionTable = ({ title, lessons, emptyMessage }) => {
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
              <TableCell>Lesson</TableCell>
              <TableCell align="right">Completions</TableCell>
              <TableCell align="right">Completion Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell component="th" scope="row">
                    {lesson.title}
                  </TableCell>
                  <TableCell align="right">{lesson.completion_count}</TableCell>
                  <TableCell align="right">{`${lesson.completion_rate.toFixed(1)}%`}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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

export default LessonCompletionTable
