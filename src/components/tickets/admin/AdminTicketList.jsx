import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  InputAdornment,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import ticketService from '../../../services/ticketService'
import TicketStatusBadge from '../shared/TicketStatusBadge'
import TicketTypeChip from '../shared/TicketTypeChip'

/**
 * Admin component for viewing and filtering all tickets
 */
const AdminTicketList = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)

        // Use search endpoint if any filters are applied, otherwise get all tickets
        let data
        if (statusFilter || typeFilter || searchTerm) {
          data = await ticketService.searchTickets({
            status: statusFilter,
            type: typeFilter,
            q: searchTerm,
          })
        } else {
          data = await ticketService.getAllTickets()
        }

        setTickets(data)
        console.info(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch tickets:', err)
        setError('Failed to load tickets. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [statusFilter, typeFilter, searchTerm])

  // Load open tickets only
  const handleShowOpenTickets = async () => {
    try {
      setLoading(true)
      const data = await ticketService.getOpenTickets()
      setTickets(data)
      setStatusFilter('open')
      setError(null)
    } catch (err) {
      console.error('Failed to fetch open tickets:', err)
      setError('Failed to load open tickets. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter('')
    setTypeFilter('')
    setSearchTerm('')
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
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

  return (
    <Card>
      <CardHeader title="Ticket Management" />
      <CardContent>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="lesson">Lesson</MenuItem>
                <MenuItem value="exercise">Exercise</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={6}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search by title, description, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button variant="contained" color="primary" onClick={handleShowOpenTickets}>
            Show Open Tickets
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Stack>

        {tickets.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">No tickets found with the current filters.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Responses</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>
                      <Link
                        to={`/admin/support/tickets/${ticket.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {ticket.title}
                      </Link>
                    </TableCell>
                    <TableCell>{ticket.user?.username || 'Unknown'}</TableCell>
                    <TableCell>
                      <TicketTypeChip type={ticket.ticket_type} />
                    </TableCell>
                    <TableCell>
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>{formatDate(ticket.created_at)}</TableCell>
                    <TableCell>{ticket.response_count || 0}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`/admin/support/tickets/${ticket.id}`}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminTicketList
