import React from 'react'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

const OutputConsole = ({
  output,
  onClear,
  title = 'Output',
  error = false,
  testResults = [], // New prop for test results
}) => {
  const [expanded, setExpanded] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState(0) // New state for active tab

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Calculate test summary
  const passedTests = testResults.filter((test) => test.passed).length
  const totalTests = testResults.length

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
        height: '22vh',
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="subtitle2"
            component="div"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              mr: 3,
            }}
          >
            {title}{' '}
          </Typography>

          {/* Move tabs to header next to title */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: '30px',
              '& .MuiTab-root': {
                py: 0,
                px: 1.5,
                minHeight: '30px',
                color: 'grey.400',
                fontSize: '0.75rem',
              },
              '& .Mui-selected': {
                color: '#fff !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#64b5f6',
                height: '2px',
              },
            }}
          >
            <Tab label="Output" id="console-tab-0" aria-controls="console-tabpanel-0" />
            <Tab
              label={`Tests ${totalTests > 0 ? `(${passedTests}/${totalTests})` : ''}`}
              id="console-tab-1"
              aria-controls="console-tabpanel-1"
            />
          </Tabs>
        </Box>

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
        <Box>
          <Box
            role="tabpanel"
            hidden={activeTab !== 0}
            id="console-tabpanel-0"
            aria-labelledby="console-tab-0"
            sx={{
              p: 2,
              height: '170px',
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

          <Box
            role="tabpanel"
            hidden={activeTab !== 1}
            id="console-tabpanel-1"
            aria-labelledby="console-tab-1"
            sx={{
              height: 'calc(22vh - 45px)', // Subtract header height to ensure proper sizing
              maxHeight: '170px',
              overflow: 'auto',
              p: 1,
            }}
          >
            {testResults.length > 0 ? (
              <List dense disablePadding>
                {testResults.map((test, index) => (
                  <ListItem
                    key={index}
                    dense
                    disableGutters
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      py: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        {test.passed ? (
                          <CheckCircleIcon fontSize="small" sx={{ color: '#4caf50' }} />
                        ) : (
                          <ErrorIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
                        )}
                      </ListItemIcon>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.85rem',
                          color: test.passed ? '#f8f9fa' : '#ff9999',
                          fontWeight: 'medium',
                        }}
                      >
                        Test Case {index + 1} {test.passed ? 'Passed' : 'Failed'}
                      </Typography>
                    </Box>

                    <Box sx={{ pl: 4, mt: 0.5, width: '100%', fontSize: '0.75rem' }}>
                      <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>
                        <strong>Input:</strong> {test.test_case?.input}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>
                        <strong>Expected:</strong> {test.test_case?.expected_output?.trim()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>
                        <strong>Actual:</strong> {test.actual_output?.trim()}
                      </Typography>

                      {!test.passed && test.error && (
                        <Typography
                          variant="caption"
                          sx={{ color: '#ff6b6b', display: 'block', mt: 0.5 }}
                        >
                          <strong>Error:</strong> {test.error}
                        </Typography>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: 'grey.500', fontStyle: 'italic', p: 1 }}>
                No test results available
              </Typography>
            )}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default OutputConsole
