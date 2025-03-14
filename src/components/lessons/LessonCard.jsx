import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea, Box, Chip, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SchoolIcon from '@mui/icons-material/School'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useTheme, alpha } from '@mui/material/styles'

const LessonCard = ({ lesson }) => {
  const navigate = useNavigate()
  const theme = useTheme()

  if (!lesson) {
    return (
      <Card
        sx={{
          height: '100%',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <CardContent
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}
        >
          <Typography>Loading Lesson...</Typography>
        </CardContent>
      </Card>
    )
  }

  const handleCardClick = () => {
    navigate(`/lessons/${lesson.id}`)
  }

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8,
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <CardMedia
          sx={{
            height: 140,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SchoolIcon
            sx={{
              fontSize: 60,
              color: theme.palette.primary.main,
            }}
          />
        </CardMedia>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            noWrap
            sx={{
              fontWeight: 'medium',
              mb: 1,
            }}
          >
            {lesson.title}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              height: '3.6em',
            }}
          >
            {lesson.description && lesson.description.length > 50
              ? `${lesson.description.substring(0, 53)}...`
              : lesson.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
            <Chip
              label={lesson.category || 'Python'}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: 1,
                fontWeight: 500,
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {lesson.duration || '15 min'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default LessonCard
