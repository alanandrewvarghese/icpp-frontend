import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Stack,
} from '@mui/material'
import {
  PeopleAltOutlined as PeopleIcon,
  CheckCircleOutlined as PassRateIcon,
  ScoreboardOutlined as ScoreIcon,
  AccessTimeOutlined as TimeIcon,
  QuizOutlined as QuizIcon,
} from '@mui/icons-material'

import quizService from '../../../services/quizService'

// Custom circular progress with percentage
const CircularProgressWithLabel = ({ value, color, size = 80, thickness = 5 }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        color={color}
        size={size}
        thickness={thickness}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          fontSize={16}
          fontWeight="bold"
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  )
}

const QuizStatistics = ({ quizId }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const statsData = await quizService.getQuizStats(quizId)
        setStats(statsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [quizId])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading statistics: {error}
      </Alert>
    )
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No statistics available for this quiz yet.
      </Alert>
    )
  }

  // Determine pass rate color based on value
  const getPassRateColor = (rate) => {
    if (rate >= 80) return 'success'
    if (rate >= 60) return 'warning'
    return 'error'
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <QuizIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" component="h2">
            Statistics for "{stats.quiz_title}"
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Summary Cards */}
        <Grid container spacing={3}>
          {/* Attempts Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <PeopleIcon color="primary" />
                  <Typography variant="h6" component="h3">
                    Attempts
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', my: 2 }}>
                  {stats.total_attempts}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  By {stats.unique_users} unique students
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pass Rate Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <PassRateIcon color="primary" />
                  <Typography variant="h6" component="h3">
                    Pass Rate
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgressWithLabel
                    value={stats.pass_rate}
                    color={getPassRateColor(stats.pass_rate)}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {stats.passing_attempts} out of {stats.total_attempts} passed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Average Score Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <ScoreIcon color="primary" />
                  <Typography variant="h6" component="h3">
                    Average Score
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', my: 2 }}>
                  {stats.avg_score}%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={stats.avg_score}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional statistics if available */}
          {stats.avg_time_spent && (
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <TimeIcon color="primary" />
                    <Typography variant="h6" component="h3">
                      Average Time
                    </Typography>
                  </Stack>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', my: 2 }}>
                    {Math.floor(stats.avg_time_spent / 60)}:
                    {(stats.avg_time_spent % 60).toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Average completion time (mm:ss)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Question Performance Section - Only show if we have question stats */}
      {stats.question_stats && stats.question_stats.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Question Performance
          </Typography>
          <Grid container spacing={2}>
            {stats.question_stats.map((question, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Q{index + 1}: {question.text}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Correctly answered by {question.correct_percentage}% of students
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={question.correct_percentage}
                        color={question.correct_percentage > 50 ? 'success' : 'error'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  )
}

export default QuizStatistics
