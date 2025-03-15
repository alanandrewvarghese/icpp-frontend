import React, { useState, useEffect } from 'react'
import { Box, Typography, Fade, Paper } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Confetti from 'react-confetti'

const ExerciseSuccess = ({ show, countdown, onComplete }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!show) return null

  return (
    <>
      {/* Confetti effect */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
      />

      {/* Success animation */}
      <Fade in={show}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '400px',
              width: '90%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckCircleIcon
                color="success"
                sx={{
                  fontSize: 80,
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(0.95)', opacity: 0.7 },
                    '70%': { transform: 'scale(1.1)', opacity: 1 },
                    '100%': { transform: 'scale(0.95)', opacity: 0.7 },
                  },
                }}
              />
              <EmojiEventsIcon
                color="primary"
                sx={{
                  fontSize: 80,
                  ml: 1,
                  animation: 'float 2s infinite ease-in-out',
                  '@keyframes float': {
                    '0%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(5deg)' },
                    '100%': { transform: 'translateY(0px) rotate(0deg)' },
                  },
                }}
              />
            </Box>

            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              Great job!
            </Typography>

            <Typography variant="h6" align="center" color="success.main" gutterBottom>
              All tests passed successfully
            </Typography>

            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              Redirecting in{' '}
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                {countdown}
              </Box>{' '}
              {countdown === 1 ? 'second' : 'seconds'}...
            </Typography>
          </Paper>
        </Box>
      </Fade>
    </>
  )
}

export default ExerciseSuccess
