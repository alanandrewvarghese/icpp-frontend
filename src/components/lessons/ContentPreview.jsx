import React from 'react'
import { Paper, Typography, Box, Divider, Container, useTheme } from '@mui/material'
import { getMarkdownStyles, MarkdownRenderer } from '../../utils/markdownUtils'

const ContentPreview = ({ content, title }) => {
  const theme = useTheme()
  const markdownStyles = getMarkdownStyles(theme)

  return (
    <Container maxWidth="md" sx={{ height: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 0.5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 120px)', // Limit maximum height
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Content Preview
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Display the lesson title if provided */}
        {title && (
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
            {title}
          </Typography>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            bgcolor: '#f5f5f5',
            flexGrow: 1,
            overflow: 'auto', // This enables scrolling
            borderRadius: 1,
            minHeight: '400px',
            maxHeight: 'calc(100vh - 300px)', // Constrain height for scrolling
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[400],
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.palette.grey[500],
            },
          }}
        >
          {content ? (
            <Box sx={markdownStyles}>
              <MarkdownRenderer content={content} />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              No content to preview. Start editing to see your content here.
            </Typography>
          )}
        </Paper>
      </Paper>
    </Container>
  )
}

export default ContentPreview
