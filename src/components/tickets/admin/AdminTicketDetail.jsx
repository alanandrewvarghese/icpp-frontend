import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  Grid,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import ticketService from '../../../services/ticketService'
import TicketStatusBadge from '../shared/TicketStatusBadge'
import TicketTypeChip from '../shared/TicketTypeChip'
import TicketResponseItem from '../shared/TicketResponseItem'
import ResponseForm from '../shared/ResponseForm'

/**
 * Admin component for managing a single ticket
 */
const AdminTicketDetail = () => {
  const { ticketId } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Status change form
  const [statusForm, setStatusForm] = useState({
    status: '',
    addNote: true,
    note: '',
  })

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        const data = await ticketService.getTicket(ticketId)
        setTicket(data)
        setStatusForm((prev) => ({
          ...prev,
          status: data.status,
        }))
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

  const handleStatusChange = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const updatedTicket = await ticketService.changeTicketStatus(
        ticketId,
        statusForm.status,
        statusForm.addNote,
        statusForm.note || `Status changed to ${statusForm.status}`,
      )

      setTicket(updatedTicket)
      setSuccessMessage(`Ticket status changed to ${statusForm.status}`)

      // Reset note field after successful submission
      setStatusForm((prev) => ({
        ...prev,
        note: '',
      }))
    } catch (err) {
      console.error('Failed to change ticket status:', err)
      setError('Failed to update ticket status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading && !ticket) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !ticket) {
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

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={`Ticket #${ticket.id}: ${ticket.title}`}
          action={
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/admin/support/tickets')}
            >
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
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Created:</strong> {formatDate(ticket.created_at)}
              </Typography>
              <Typography variant="body1">
                <strong>Last Updated:</strong> {formatDate(ticket.updated_at)}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Submitted by:</strong> {ticket.user?.username} ({ticket.user?.email})
              </Typography>
              {ticket.related_lesson && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Related Lesson:</strong> {ticket.related_lesson}
                </Typography>
              )}
              {ticket.related_exercise && (
                <Typography variant="body1">
                  <strong>Related Exercise:</strong> {ticket.related_exercise}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardHeader title="Description" />
            <CardContent>
              <ReactMarkdown>{ticket.description}</ReactMarkdown>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardHeader title="Change Status" />
            <CardContent>
              <Box component="form" onSubmit={handleStatusChange}>
                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <FormControl fullWidth>
                      <Select
                        value={statusForm.status}
                        onChange={(e) =>
                          setStatusForm({
                            ...statusForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={8}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={statusForm.addNote}
                          onChange={(e) =>
                            setStatusForm({
                              ...statusForm,
                              addNote: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Add note about status change"
                    />
                    {statusForm.addNote && (
                      <TextField
                        fullWidth
                        placeholder="Note about status change"
                        sx={{ mt: 2 }}
                        value={statusForm.note}
                        onChange={(e) =>
                          setStatusForm({
                            ...statusForm,
                            note: e.target.value,
                          })
                        }
                      />
                    )}
                  </Grid>
                </Grid>

                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || statusForm.status === ticket.status}
                  >
                    {loading ? 'Updating...' : 'Update Status'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No responses yet.
            </Typography>
          )}

          <ResponseForm ticketId={ticket.id} onResponseAdded={handleResponseAdded} />
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminTicketDetail
