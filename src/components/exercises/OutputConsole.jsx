import React from 'react'
import { Box, Typography, Paper, IconButton, Tooltip, Collapse } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

const OutputConsole = ({ output, onClear, title = 'Output', error = false }) => {
  const [expanded, setExpanded] = React.useState(true)

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.900',
        color: error ? '#ff6b6b' : '#f8f9fa',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: expanded ? '1px solid rgba(255,255,255,0.1)' : 'none',
          bgcolor: 'rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
        onClick={toggleExpand}
      >
        <Typography
          variant="subtitle2"
          component="div"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}{' '}
          {error && output && (
            <Box component="span" sx={{ color: '#ff6b6b', ml: 1 }}>
              • Error
            </Box>
          )}
        </Typography>
        <Box>
          <Tooltip title="Copy to clipboard">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                handleCopy()
              }}
              sx={{ color: 'grey.400', '&:hover': { color: 'grey.100' } }}
              disabled={!output}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {onClear && (
            <Tooltip title="Clear console">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                sx={{ color: 'grey.400', '&:hover': { color: 'grey.100' } }}
                disabled={!output}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            size="small"
            onClick={toggleExpand}
            sx={{ color: 'grey.400', '&:hover': { color: 'grey.100' } }}
          >
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{
            p: 2,
            maxHeight: '200px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {output ? (
            output
          ) : (
            <Typography variant="body2" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
              Run your code to see output here
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}

export default OutputConsole
