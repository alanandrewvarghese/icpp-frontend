import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Paper,
  Link,
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import ticketService from '../../../services/ticketService'
import { fetchExercise } from '../../../services/exerciseService'
import { fetchLesson } from '../../../services/lessonService'
import TicketStatusBadge from '../shared/TicketStatusBadge'
import TicketTypeChip from '../shared/TicketTypeChip'
import TicketResponseItem from '../shared/TicketResponseItem'
import ResponseForm from '../shared/ResponseForm'

/**
 * Component to display detailed view of a ticket with responses
 */
const TicketDetail = () => {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null)
  const [relatedExercise, setRelatedExercise] = useState(null)
  const [relatedLesson, setRelatedLesson] = useState(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        const data = await ticketService.getTicket(ticketId)
        setTicket(data)
        console.info('Get Ticket, User TicketDetail', data)

        // Fetch related exercise if exists
        if (data.related_exercise) {
          try {
            const exerciseData = await fetchExercise(data.related_exercise)
            setRelatedExercise(exerciseData)
          } catch (err) {
            console.error(`Failed to fetch related exercise ${data.related_exercise}:`, err)
          }
        }

        // Fetch related lesson if exists
        if (data.related_lesson) {
          try {
            const lessonData = await fetchLesson(data.related_lesson)
            setRelatedLesson(lessonData)
          } catch (err) {
            console.error(`Failed to fetch related lesson ${data.related_lesson}:`, err)
          }
        }

        setError(null)
      } catch (err) {
        console.error(`Failed to fetch ticket ${ticketId}:`, err)
        setError('Failed to load ticket details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()

    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [ticketId, successMessage])

  const handleResponseAdded = (updatedTicket) => {
    setTicket(updatedTicket)
    setSuccessMessage('Response added successfully!')
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!ticket) {
    return <Alert severity="warning">Ticket not found</Alert>
  }

  return (
    <Box>
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={`Ticket: ${ticket.title}`}
          action={
            <Button variant="outlined" size="small" onClick={() => navigate('/support/tickets')}>
              Back to Tickets
            </Button>
          }
          subheader={
            <Box sx={{ mt: 1 }}>
              <TicketTypeChip type={ticket.ticket_type} />
              <TicketStatusBadge status={ticket.status} />
            </Box>
          }
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Created: {formatDate(ticket.created_at)} | Last Updated: {formatDate(ticket.updated_at)}
          </Typography>

          <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 4 }}>
            <ReactMarkdown>{ticket.description}</ReactMarkdown>
          </Paper>

          {ticket.related_lesson && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Related Lesson:</strong>{' '}
                {relatedLesson ? (
                  <Link
                    component={RouterLink}
                    to={`/lessons/${ticket.related_lesson}`}
                    color="primary"
                  >
                    {relatedLesson.title || relatedLesson.name || 'View Lesson'}
                  </Link>
                ) : (
                  <span>Loading lesson details...</span>
                )}
              </Typography>
            </Box>
          )}

          {ticket.related_exercise && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Related Exercise:</strong>{' '}
                {relatedExercise ? (
                  <Link
                    component={RouterLink}
                    to={`/exercises/${ticket.related_exercise}`}
                    color="primary"
                  >
                    {relatedExercise.title || relatedExercise.name || 'View Exercise'}
                  </Link>
                ) : (
                  <span>Loading exercise details...</span>
                )}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 3 }}>
            Responses
          </Typography>

          {ticket.responses && ticket.responses.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              {ticket.responses.map((response) => (
                <TicketResponseItem key={response.id} response={response} />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No responses yet.
            </Typography>
          )}

          {ticket.status !== 'resolved' && (
            <ResponseForm ticketId={ticket.id} onResponseAdded={handleResponseAdded} />
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default TicketDetail
