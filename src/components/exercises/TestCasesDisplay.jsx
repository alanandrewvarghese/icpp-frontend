import React, { useState } from 'react'
import {
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Divider,
} from '@mui/material'
import InputIcon from '@mui/icons-material/Input'
import OutputIcon from '@mui/icons-material/Output'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const TestCasesDisplay = ({ testCases }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  if (!testCases || !testCases.length) {
    return (
      <Box sx={{ py: 1 }}>
        <Typography color="text.secondary" variant="body2">
          No test cases available
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 1 }}>
      {testCases.map((test, index) => (
        <Accordion
          key={index}
          disableGutters
          elevation={0}
          expanded={expanded === index}
          onChange={() => setExpanded(expanded === index ? false : index)}
          sx={{
            mb: 1,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px !important',
            '&:before': { display: 'none' },
            overflow: 'hidden',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              Test Case {index + 1}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, py: 1, pt: 0 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  icon={<InputIcon fontSize="small" />}
                  label="Input"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    mr: 1,
                    borderRadius: 0.5,
                  }}
                />
                <Box
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    bgcolor: alpha(theme.palette.grey[900], 0.02),
                    p: 1,
                    borderRadius: 1,
                    flexGrow: 1,
                    overflow: 'auto',
                  }}
                >
                  {test.input || <em style={{ color: theme.palette.text.disabled }}>No input</em>}
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={<OutputIcon fontSize="small" />}
                  label="Expected Output"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    mr: 1,
                    borderRadius: 0.5,
                  }}
                />
                <Box
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    bgcolor: alpha(theme.palette.grey[900], 0.02),
                    p: 1,
                    borderRadius: 1,
                    flexGrow: 1,
                    overflow: 'auto',
                  }}
                >
                  {test.expected_output || (
                    <em style={{ color: theme.palette.text.disabled }}>No output</em>
                  )}
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default TestCasesDisplay
