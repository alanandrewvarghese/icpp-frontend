import React from 'react'
import { Paper, Typography, Box } from '@mui/material'
import { MarkdownRenderer } from '../../../../utils/markdownUtils'
import CompletionStatus from '../../../common/CompletionStatus'
import LessonCompletionControl from '../LessonCompletionControl'

const ContentTab = ({ lesson, theme, markdownStyles }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 1 }} elevation={0} variant="outlined">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          {lesson.title}
        </Typography>
        <CompletionStatus contentType="lesson" contentId={lesson.id} />
      </Box>

      <Box sx={markdownStyles}>
        <MarkdownRenderer content={lesson.content} />
      </Box>

      {/* <LessonCompletionControl lessonId={lesson.id} /> */}
    </Paper>
  )
}

export default ContentTab
