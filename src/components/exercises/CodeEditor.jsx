import React, { useState, useEffect } from 'react'
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
  IconButton,
  Snackbar,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SendIcon from '@mui/icons-material/Send'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import CloseIcon from '@mui/icons-material/Close'
import MarginTop from '../layout/MarginTop'

const CodeEditor = ({ code, onCodeChange, onRun, onSubmit, submitting, feedback }) => {
  const [userInput, setUserInput] = useState('')
  const [runOperation, setRunOperation] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [openFeedback, setOpenFeedback] = useState(false)

  // Show feedback popup when feedback changes
  useEffect(() => {
    if (feedback) {
      setOpenFeedback(true)
    }
  }, [feedback])

  const handleCloseFeedback = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenFeedback(false)
  }

  const handleRunWithInput = () => {
    setRunOperation(true)
    onRun(userInput)
    setTimeout(() => setRunOperation(false), 2000)
  }

  const handleSubmitSolution = () => {
    setRunOperation(false)
    onSubmit()
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  // Feedback popup that appears in both views
  const feedbackAlert = feedback && (
    <Snackbar
      open={openFeedback}
      autoHideDuration={4000}
      onClose={handleCloseFeedback}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: '68px !important', // Override the default top position
        '& .MuiSnackbar-root': { top: '64px' },
      }}
    >
      <Alert
        severity={feedback.passed ? 'success' : 'error'}
        sx={{
          width: '100%',
          boxShadow: 3,
          '& .MuiAlert-message': { width: '100%' },
        }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseFeedback}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <AlertTitle>
          {feedback.passed ? 'Success!' : 'Your code did not pass all the test cases.'}
        </AlertTitle>
        <Box sx={{ maxHeight: '100px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
          {feedback.message}
        </Box>
      </Alert>
    </Snackbar>
  )

  // If fullscreen, render a fixed position container over the whole viewport
  if (fullscreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1300,
          bgcolor: 'background.paper',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {feedbackAlert}
        {/* Monaco Editor - taller in fullscreen mode with overlaid exit button */}
        <MarginTop mt="64px" />
        <Box sx={{ flex: 1, minHeight: 0, mb: 2, position: 'relative' }}>
          <Tooltip title="Exit fullscreen">
            <IconButton
              onClick={toggleFullscreen}
              color="primary"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10,
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              <FullscreenExitIcon />
            </IconButton>
          </Tooltip>

          <Editor
            height="calc(100vh - 183px)"
            defaultLanguage="python"
            value={code}
            onChange={onCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
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

        {/* Controls */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: -0.3 }}>
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
                rows={1}
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
                      submitting && runOperation ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PlayArrowIcon />
                      )
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
      </Box>
    )
  }

  // Regular non-fullscreen view
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {feedbackAlert}
      {/* Monaco Editor with overlaid fullscreen button */}
      <Box sx={{ flex: 1, minHeight: 0, mb: 2, position: 'relative' }}>
        <Tooltip title="Fullscreen mode">
          <IconButton
            onClick={toggleFullscreen}
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
          >
            <FullscreenIcon />
          </IconButton>
        </Tooltip>

        <Editor
          height="43.5vh"
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: -0.3 }}>
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
              rows={1}
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
    </Box>
  )
}

export default CodeEditor
