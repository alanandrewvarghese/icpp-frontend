import React from 'react'
import { Paper, Typography, Box } from '@mui/material'
import { MarkdownRenderer } from '../../../../utils/markdownUtils'

const ContentTab = ({ lesson, theme, markdownStyles }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 1 }} elevation={0} variant="outlined">
      <Typography variant="h5" component="h2" sx={{ mt: 0, mb: 3, fontWeight: 500 }}>
        {lesson.title}
      </Typography>

      <Box sx={markdownStyles}>
        <MarkdownRenderer content={lesson.content} />
      </Box>
    </Paper>
  )
}

export default ContentTab
