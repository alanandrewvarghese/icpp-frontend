import React from 'react'
import { Typography, Paper, Box, Link } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const ContentTab = ({ lesson, theme }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
      <Typography variant="h5" component="h2" sx={{ mt: 0, mb: 3, fontWeight: 500 }}>
        Introduction
      </Typography>
      <Box
        sx={{
          lineHeight: 1.7,
          '& h2': { mt: 4, mb: 2, fontWeight: 500 },
          '& h3': { mt: 3, mb: 2, fontWeight: 500 },
          '& p': { mb: 2 },
          '& ul, & ol': { mb: 2, pl: 2 },
          '& li': { mb: 1 },
          '& a': { color: theme.palette.primary.main },
          '& blockquote': {
            borderLeft: `4px solid ${theme.palette.grey[300]}`,
            pl: 2,
            py: 1,
            my: 2,
            bgcolor: alpha(theme.palette.grey[400], 0.1),
            borderRadius: 1,
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match && match[1] === 'python' ? (
                <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </Box>
    </Paper>
  )
}

export default ContentTab
