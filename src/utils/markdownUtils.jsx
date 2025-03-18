import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

/**
 * Get markdown styling for consistent markdown rendering across the application
 * @param {object} theme - MUI theme object
 * @returns {object} Styling object for markdown content
 */
export const getMarkdownStyles = (theme) => ({
  lineHeight: 1.7,
  '& h1': { mt: 4, mb: 2, fontWeight: 500, fontSize: 23 },
  '& h2': { mt: 3, mb: 2, fontWeight: 500 },
  '& h3': { mt: 2, mb: 2, fontWeight: 500 },
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
    // backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: alpha(theme.palette.primary.main, 1),
    padding: '2px 4px',
    borderRadius: '4px',
    fontFamily: '"Roboto Mono", monospace',
  },
  '& pre': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '4px',
    padding: '1rem',
    margin: theme.spacing(2, 0),
    overflow: 'auto',
  },
  '& pre > div': {
    borderRadius: '4px',
    width: '100%',
    overflow: 'auto',
  },
  '& img': { maxWidth: '100%' },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing(2),
  },
  '& th, & td': {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
  },
})

/**
 * Pre-process markdown content to handle escape characters properly
 * @param {string} content - Raw markdown content
 * @returns {string} Processed content with escape characters handled
 */
export const processMarkdownContent = (content) => {
  if (!content) return ''

  // Process the content carefully to avoid breaking code blocks
  let processedContent = content

  // First, temporarily protect code blocks
  const codeBlocks = []
  processedContent = processedContent.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `CODE_BLOCK_${codeBlocks.length}`
    codeBlocks.push(match)
    return placeholder
  })

  // Now process escape characters outside of code blocks
  processedContent = processedContent.replace(/\\([\\`*{}[\]()#+\-.!_>~|])/g, '$1')

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(`CODE_BLOCK_${index}`, block)
  })

  return processedContent
}

/**
 * Common markdown component configuration for syntax highlighting and formatting
 */
export const markdownComponents = {
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
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

/**
 * Reusable Markdown Renderer component
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 */
export const MarkdownRenderer = ({ content }) => {
  const processedContent = processMarkdownContent(content)

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {processedContent}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
