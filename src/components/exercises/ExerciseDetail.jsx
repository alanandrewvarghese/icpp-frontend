import React, { useState, useEffect } from 'react'
import { fetchExercise } from '../../services/exerciseService'
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Divider,
  alpha,
  useTheme,
  List,
  ListItem,
  Grid,
  Chip,
} from '@mui/material'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeIcon from '@mui/icons-material/Code'
import InputIcon from '@mui/icons-material/Input'
import OutputIcon from '@mui/icons-material/Output'
import ReactMarkdown from 'react-markdown'
import TestCasesDisplay from './TestCasesDisplay'

const ExerciseDetail = ({ exerciseId }) => {
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const theme = useTheme()

  useEffect(() => {
    const loadExercise = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchExercise(exerciseId)
        setExercise(data)
      } catch (err) {
        setError(err.message || 'Failed to load exercise details.')
        console.error('Failed to fetch exercise details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (exerciseId) {
      loadExercise()
    }
  }, [exerciseId])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !exercise) {
    return <Alert severity="error">{error || 'Exercise not found'}</Alert>
  }

  const renderTestCases = () => {
    return <TestCasesDisplay testCases={exercise.test_cases} />
  }

  return (
    <Paper elevation={0} variant="" sx={{ p: 0, borderRadius: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
            p: 1.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <CodeIcon color="primary" />
        </Box>
        <Typography variant="h5" component="h2" fontWeight="500">
          {exercise.title}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <ReactMarkdown
          components={{
            p: (props) => <Typography variant="body1" paragraph sx={{ mb: 1.5 }} {...props} />,
            h1: (props) => <Typography variant="h5" gutterBottom {...props} />,
            h2: (props) => <Typography variant="h6" gutterBottom {...props} />,
            h3: (props) => (
              <Typography variant="subtitle1" fontWeight="500" gutterBottom {...props} />
            ),
            ul: (props) => <Box component="ul" sx={{ pl: 2 }} {...props} />,
            ol: (props) => <Box component="ol" sx={{ pl: 2 }} {...props} />,
            li: (props) => (
              <Typography component="li" variant="body1" sx={{ mb: 0.5 }} {...props} />
            ),
            code: (props) => (
              <Box
                component="code"
                sx={{
                  bgcolor: alpha(theme.palette.grey[900], 0.07),
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
                {...props}
              />
            ),
          }}
        >
          {exercise.description}
        </ReactMarkdown>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Test Cases
        </Typography>
        {renderTestCases()}
      </Box>
    </Paper>
  )
}

export default ExerciseDetail
