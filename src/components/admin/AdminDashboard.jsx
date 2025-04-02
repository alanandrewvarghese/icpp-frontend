import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from '@mui/material'
import {
  Group as UsersIcon,
  School as InstructorIcon,
  Person as StudentIcon,
  BookOutlined as LessonIcon,
  CodeOutlined as ExerciseIcon,
} from '@mui/icons-material'
import { fetchUsers } from '../../services/userManagementService'
import { fetchLessons } from '../../services/lessonService'
import { fetchExercises } from '../../services/exerciseService'
import { useTheme } from '@mui/material/styles'

const StatCard = ({ icon, title, count, color }) => {
  const theme = useTheme()

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
              {count}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: theme.palette[color].lighter || theme.palette[color].light,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 30, color: theme.palette[color].main } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    instructors: 0,
    pendingInstructors: 0,
    students: 0,
    lessons: 0,
    exercises: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Fetch all required data
        const [users, lessons, exercises] = await Promise.all([
          fetchUsers(),
          fetchLessons(),
          fetchExercises(),
        ])

        // Calculate stats
        const instructors = users.filter((u) => u.role === 'instructor' && u.is_active)
        const pendingInstructors = users.filter((u) => u.role === 'instructor' && !u.is_active)
        const students = users.filter((u) => u.role === 'student')

        setStats({
          totalUsers: users.length,
          instructors: instructors.length,
          pendingInstructors: pendingInstructors.length,
          students: students.length,
          lessons: lessons.length,
          exercises: exercises.length,
        })
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          icon={<UsersIcon />}
          title="Total Users"
          count={stats.totalUsers}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard icon={<StudentIcon />} title="Students" count={stats.students} color="info" />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          icon={<InstructorIcon />}
          title="Instructors"
          count={stats.instructors}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          icon={<InstructorIcon />}
          title="Pending Approvals"
          count={stats.pendingInstructors}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard icon={<LessonIcon />} title="Lessons" count={stats.lessons} color="secondary" />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard icon={<ExerciseIcon />} title="Exercises" count={stats.exercises} color="error" />
      </Grid>
      <Grid item xs={12} mt={0}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Paper sx={{ p: 3 }} elevation={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                component="a"
                href="/admin/users?type=instructor&status=pending"
                startIcon={<InstructorIcon />}
              >
                View Pending Instructor Approvals
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                color="info"
                component="a"
                href="/lessons"
                startIcon={<LessonIcon />}
              >
                View Lessons
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                component="a"
                href="/exercises"
                startIcon={<ExerciseIcon />}
              >
                View Exercises
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default AdminDashboard
