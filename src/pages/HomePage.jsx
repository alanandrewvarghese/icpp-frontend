import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'
import MarginTop from '../components/layout/MarginTop'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CodeIcon from '@mui/icons-material/Code'
import SchoolIcon from '@mui/icons-material/School'
import GroupIcon from '@mui/icons-material/Group'
import Divider from '@mui/material/Divider'

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section with Gradient */}
      <Box
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: 8,
          textAlign: 'center',
        })}
      >
        <Container maxWidth="md">
          <MarginTop />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Welcome to PyInteract!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Your interactive platform for learning Python programming
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/register/student"
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                  color: (theme) => theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                Register
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/login"
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  fontWeight: 'bold',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose PyInteract?
        </Typography>
        <Divider sx={{ mb: 6, mx: 'auto', width: '60px', borderBottomWidth: 3 }} />

        <Grid container spacing={4}>
          {/* Feature Cards */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <CodeIcon
                  sx={{ fontSize: 60, color: (theme) => theme.palette.primary.main, mb: 2 }}
                />
                <Typography variant="h5" component="h3" gutterBottom fontWeight="medium">
                  Interactive Learning
                </Typography>
                <Typography variant="body1">
                  Code directly in your browser with real-time feedback and guidance to master
                  Python concepts faster.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <SchoolIcon
                  sx={{ fontSize: 60, color: (theme) => theme.palette.primary.main, mb: 2 }}
                />
                <Typography variant="h5" component="h3" gutterBottom fontWeight="medium">
                  Structured Curriculum
                </Typography>
                <Typography variant="body1">
                  Follow our carefully designed learning path from beginner fundamentals to advanced
                  Python techniques.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <GroupIcon
                  sx={{ fontSize: 60, color: (theme) => theme.palette.primary.main, mb: 2 }}
                />
                <Typography variant="h5" component="h3" gutterBottom fontWeight="medium">
                  Community Support
                </Typography>
                <Typography variant="body1">
                  Join our community of learners, share your progress, and get help when you need
                  it.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HomePage
