import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Grid, Paper, Box, CircularProgress, Alert } from '@mui/material'
import ExerciseDetail from '../../components/exercises/ExerciseDetail'
import MarginTop from '../../components/layout/MarginTop'
import PaddingTop from '../../components/layout/PaddingTop'
import CodeEditor from '../../components/exercises/CodeEditor'
import OutputConsole from '../../components/exercises/OutputConsole'
import ExerciseSuccess from '../../components/exercises/ExerciseSuccess'
import sandboxService from '../../services/sandboxService'
import { fetchExercise } from '../../services/exerciseService' // Import the correct service

const ExercisePage = () => {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const [exercise, setExercise] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const [isOutputError, setIsOutputError] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true)
        // Use the correct service function and endpoint
        const exerciseData = await fetchExercise(exerciseId)
        setExercise(exerciseData)
        setCode(exerciseData.starter_code || '')
      } catch (err) {
        setError('Failed to load exercise. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadExercise()
  }, [exerciseId])

  const handleCodeChange = (value) => {
    setCode(value)
  }

  const runCode = async (userInput = '') => {
    try {
      setSubmitting(false)
      setFeedback(null)
      setIsOutputError(false)

      // Execute code using sandbox service
      const executionResponse = await sandboxService.executeCode(code, exerciseId, userInput)

      // If API returns execution ID for polling
      if (executionResponse.id) {
        const result = await sandboxService.pollExecutionResults(executionResponse.request)
        setTestResults(result.test_results)

        // Check for errors in execution
        if (result.error) {
          setIsOutputError(true)
          setOutput(result.error || 'Execution failed')
        } else {
          setOutput(result.output || 'No output')
        }
      } else {
        // If API returns immediate results
        setOutput(executionResponse.output || executionResponse.error || 'No output')
        if (executionResponse.error) {
          setIsOutputError(true)
        }
      }
    } catch (err) {
      setIsOutputError(true)
      setOutput(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Add this useEffect to handle the countdown and navigation
  useEffect(() => {
    let countdownInterval

    if (redirectCountdown > 0) {
      countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1)
      }, 1000)
    } else if (redirectCountdown === 0 && exercise) {
      // Navigate when countdown reaches zero
      navigate(`/lessons/${exercise.lesson}?tab=exercises`)
    }

    // Clean up interval
    return () => {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [redirectCountdown, exercise, navigate])

  const submitSolution = async () => {
    try {
      setSubmitting(true)
      const result = await sandboxService.submitSolution(exerciseId, code)
      setFeedback(result)

      // If all tests passed
      if (result.is_correct) {
        console.log('Test cases passed')
        setFeedback({
          passed: true,
          message: `All Test Cases Passed!`,
        })

        // Show success animation and start countdown
        setShowSuccess(true)
        setRedirectCountdown(3)
      }
    } catch (err) {
      setFeedback({
        passed: false,
        message: `Error: ${err.message}`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const clearOutput = () => {
    setOutput('')
    setIsOutputError(false)
  }

  if (loading) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
      >
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <>
      {/* This overlay div will cover the entire viewport including the footer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          bgcolor: 'background.default',
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: 0,
          height: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <MarginTop mt="64px" />

        <Grid container spacing={1} sx={{ flex: 1, overflow: 'hidden' }}>
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
              }}
            >
              <ExerciseDetail exerciseId={exerciseId} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ flex: 7, overflow: 'hidden', minHeight: 0 }}>
                  <CodeEditor
                    code={code}
                    onCodeChange={handleCodeChange}
                    onRun={runCode}
                    onSubmit={submitSolution}
                    submitting={submitting}
                    feedback={feedback}
                  />
                </Box>

                <Box sx={{ flex: 3, minHeight: 0 }}>
                  <OutputConsole
                    output={output}
                    onClear={clearOutput}
                    error={isOutputError}
                    title=">>"
                    testResults={testResults}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Success animation and countdown overlay */}
      <ExerciseSuccess show={showSuccess} countdown={redirectCountdown} />
    </>
  )
}

export default ExercisePage
