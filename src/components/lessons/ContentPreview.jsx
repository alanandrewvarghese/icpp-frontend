import React from 'react'
import { Paper, Typography, Box, Divider, Container, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const ContentPreview = ({ content, title }) => {
  const theme = useTheme()

  // Pre-process content to handle escape characters properly
  const processedContent = content ? content.replace(/\\([\\`*{}[\]()#+\-.!_>~|])/g, '$1') : ''

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 0.5, height: '100%', display: 'flex', flexDirection: 'column' }}
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
            overflow: 'auto',
            borderRadius: 1,
            minHeight: '500px', // Minimum height to match form approximately
          }}
        >
          {content ? (
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
                '& code': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: '"Roboto Mono", monospace',
                },
                '& pre': {
                  backgroundColor: '#2d2d2d',
                  borderRadius: '4px',
                  padding: 0,
                  margin: theme.spacing(2, 0),
                },
                '& pre > div': {
                  borderRadius: '4px',
                },
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        wrapLines={true}
                        showLineNumbers={true}
                      >
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
                {processedContent}
              </ReactMarkdown>
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
