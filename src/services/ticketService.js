import apiClient from './apiClient'

const BASE_URL = '/support'

/**
 * Service that handles all ticket and response related API operations
 */
const ticketService = {
  /**
   * User Ticket Operations
   */

  // Get all tickets for the current logged-in user
  getUserTickets: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/tickets/my_tickets/`)
      return response.data
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      throw error
    }
  },

  // Get a single ticket by ID
  getTicket: async (ticketId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/tickets/${ticketId}/`)
      return response.data
    } catch (error) {
      console.error(`Error fetching ticket ${ticketId}:`, error)
      throw error
    }
  },

  // Create a new ticket
  createTicket: async (ticketData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/tickets/`, ticketData)
      console.info(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  },

  // Update an existing ticket
  updateTicket: async (ticketId, ticketData) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/tickets/${ticketId}/`, ticketData)
      return response.data
    } catch (error) {
      console.error(`Error updating ticket ${ticketId}:`, error)
      throw error
    }
  },

  // Delete a ticket
  deleteTicket: async (ticketId) => {
    try {
      await apiClient.delete(`${BASE_URL}/tickets/${ticketId}/`)
      return true
    } catch (error) {
      console.error(`Error deleting ticket ${ticketId}:`, error)
      throw error
    }
  },

  // Add a response to a ticket
  addResponse: async (ticketId, message) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/tickets/${ticketId}/add_response/`, {
        message,
      })
      return response.data
    } catch (error) {
      console.error('Error adding response:', error)
      throw error
    }
  },

  /**
   * Admin Ticket Operations
   */

  // Get all tickets (admin only)
  getAllTickets: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/admin/tickets/`)
      return response.data
    } catch (error) {
      console.error('Error fetching all tickets:', error)
      throw error
    }
  },

  // Get only open tickets (admin only)
  getOpenTickets: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/admin/tickets/open_tickets/`)
      return response.data
    } catch (error) {
      console.error('Error fetching open tickets:', error)
      throw error
    }
  },

  // Change ticket status (admin only)
  changeTicketStatus: async (ticketId, newStatus, addNote = false, note = '') => {
    try {
      const response = await apiClient.post(
        `${BASE_URL}/admin/tickets/${ticketId}/change_status/`,
        {
          status: newStatus,
          add_note: addNote,
          note,
        },
      )
      return response.data
    } catch (error) {
      console.error('Error changing ticket status:', error)
      throw error
    }
  },

  // Search tickets with filters (admin only)
  searchTickets: async (params) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/admin/tickets/search/`, {
        params,
      })
      return response.data
    } catch (error) {
      console.error('Error searching tickets:', error)
      throw error
    }
  },
}

export default ticketService
