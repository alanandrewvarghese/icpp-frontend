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

const ErrorTypesTable = ({ title, errors, emptyMessage }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title || 'Common Error Types'}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Error Type</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors && errors.length > 0 ? (
              errors.map((error, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row" sx={{ maxWidth: '70%', overflow: 'auto' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {error.error_type}
                    </pre>
                  </TableCell>
                  <TableCell align="right">{error.count}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  {emptyMessage || 'No error data available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ErrorTypesTable
