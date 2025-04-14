import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
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
  FormControl,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import ticketService from '../../../services/ticketService'
import TicketStatusBadge from '../shared/TicketStatusBadge'
import TicketTypeChip from '../shared/TicketTypeChip'

/**
 * Component to display a list of user tickets with filtering options
 */
const TicketList = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'open', 'resolved'
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)
        const data = await ticketService.getUserTickets()
        setTickets(data)
        console.info('User Tickets', data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch tickets:', err)
        setError('Failed to load tickets. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Filter tickets based on status and search term
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filter === 'all' || ticket.status === filter
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

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
      <CardHeader title="My Support Tickets" />
      <CardContent>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="all">All Tickets</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredTickets.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              No tickets found. Create a new support ticket to get help.
            </Typography>
            {/* <Button component={Link} to="/support/new-ticket" variant="contained" color="primary">
              Create New Ticket
            </Button> */}
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Responses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>
                      <Link to={`/support/tickets/${ticket.id}`} style={{ textDecoration: 'none' }}>
                        {ticket.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <TicketTypeChip type={ticket.ticket_type} />
                    </TableCell>
                    <TableCell>
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>{formatDate(ticket.created_at)}</TableCell>
                    <TableCell>{ticket.response_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button component={Link} to="/support/new-ticket" variant="contained" color="primary">
          Create New Ticket
        </Button>
      </CardActions>
    </Card>
  )
}

export default TicketList
