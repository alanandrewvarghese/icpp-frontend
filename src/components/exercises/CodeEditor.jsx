import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  TextField,
  Divider,
  Typography,
  Tooltip,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SendIcon from '@mui/icons-material/Send'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const CodeEditor = ({ code, onCodeChange, onRun, onSubmit, submitting, feedback }) => {
  const [userInput, setUserInput] = useState('')
  const [runOperation, setRunOperation] = useState(false)

  const handleRunWithInput = () => {
    setRunOperation(true)
    onRun(userInput) // This calls the function that uses sandboxService.executeCode
    // Reset after a short delay
    setTimeout(() => setRunOperation(false), 2000)
  }

  const handleSubmitSolution = () => {
    setRunOperation(false)
    onSubmit() // This calls the function that uses sandboxService.submitSolution
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Monaco Editor */}
      <Box sx={{ flex: 1, minHeight: 0, mb: 2 }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            folding: true,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
          }}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Input Field and Buttons in a row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          {/* Input Field */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Program Input
              </Typography>
              <Tooltip title="Input provided to your program's stdin">
                <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </Tooltip>
            </Box>
            <TextField
              variant="outlined"
              size="small"
              multiline
              rows={2}
              placeholder="Enter input for your program here"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              sx={{ width: '100%' }}
            />
          </Box>

          {/* Buttons aligned to the right */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', pt: 3.5 }}>
            <Tooltip title="Run your code with the input provided">
              <span style={{ display: 'inline-block' }}>
                <Button
                  variant="contained"
                  onClick={handleRunWithInput}
                  disabled={submitting}
                  color="primary"
                  startIcon={
                    submitting && runOperation ? <CircularProgress size={20} /> : <PlayArrowIcon />
                  }
                  sx={{ minWidth: '120px' }}
                >
                  {submitting && runOperation ? 'Running...' : 'Run Code'}
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Submit your solution to be tested">
              <span style={{ display: 'inline-block' }}>
                <Button
                  variant="outlined"
                  onClick={handleSubmitSolution}
                  disabled={submitting}
                  color="secondary"
                  endIcon={
                    submitting && !runOperation ? <CircularProgress size={20} /> : <SendIcon />
                  }
                  sx={{ minWidth: '160px' }}
                >
                  {submitting && !runOperation ? 'Submitting...' : 'Submit Solution'}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Feedback Display */}
      {feedback && (
        <Alert
          severity={feedback.passed ? 'success' : 'error'}
          sx={{ mt: 2, '& .MuiAlert-message': { width: '100%' } }}
        >
          <AlertTitle>{feedback.passed ? 'Success!' : 'Failed Tests'}</AlertTitle>
          <Box sx={{ maxHeight: '150px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {feedback.message}
          </Box>
        </Alert>
      )}
    </Box>
  )
}

export default CodeEditor
