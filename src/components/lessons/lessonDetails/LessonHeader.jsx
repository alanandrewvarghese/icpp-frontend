import React from 'react'
import { Paper, Box, Typography, Chip, IconButton } from '@mui/material'
import {
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkOutlineIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import toTitleCase from '../../../utils/toTitleCase'

const LessonHeader = ({ lesson, bookmarked, handleBookmark, theme }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        borderLeft: `4px solid ${theme.palette.primary.main}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            {lesson.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<SchoolIcon />}
              label={lesson.category || 'Python'}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.dark,
              }}
            />
            <Chip
              icon={<TimeIcon />}
              label={lesson.duration || '15 minutes'}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.dark,
              }}
            />
            {lesson.difficulty && (
              <Chip
                label={lesson.difficulty}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.dark,
                }}
              />
            )}
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {lesson.description}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Author: {toTitleCase(lesson.created_by_name)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBookmark} color="primary" sx={{ ml: 1 }}>
            {bookmarked ? <BookmarkIcon /> : <BookmarkOutlineIcon />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default LessonHeader
