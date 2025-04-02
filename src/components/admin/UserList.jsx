import React, { useState, useEffect } from 'react'
import {
  fetchUsers,
  fetchInstructors,
  fetchStudents,
  approveInstructor,
  deleteUser,
  updateUser,
  disableUser,
  enableUser, // Add import for enableUser
} from '../../services/userManagementService'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import {
  Check as ApproveIcon,
  Delete as DeleteIcon,
  PersonOutline as PersonIcon,
  FilterAlt as FilterIcon,
  Edit as EditIcon,
  Block as DisableIcon,
  PlayArrow as EnableIcon, // Add import for EnableIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

const UserList = ({ initialTypeFilter = 'all', initialStatusFilter = 'all' }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const theme = useTheme()

  // Add filter state
  const [userTypeFilter, setUserTypeFilter] = useState(initialTypeFilter) // 'all', 'student', 'instructor'
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter) // 'all', 'active', 'inactive', 'pending'

  // Add new states for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [disableDialogOpen, setDisableDialogOpen] = useState(false)
  const [enableDialogOpen, setEnableDialogOpen] = useState(false) // Add enable dialog state
  const [editFormData, setEditFormData] = useState({
    email: '',
    role: '',
  })

  const loadUsers = async () => {
    try {
      setLoading(true)
      let data = []

      // Fetch based on user type filter
      switch (userTypeFilter) {
        case 'student':
          data = await fetchStudents()
          break
        case 'instructor':
          data = await fetchInstructors()
          break
        default:
          data = await fetchUsers()
      }

      // Apply status filter if needed
      if (statusFilter !== 'all') {
        data = data.filter((user) => {
          if (statusFilter === 'active') return user.is_active
          if (statusFilter === 'inactive') return !user.is_active && user.role !== 'instructor'
          if (statusFilter === 'pending') return user.role === 'instructor' && !user.is_active
          return true
        })
      }

      setUsers(data)
    } catch (err) {
      setError(err.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [userTypeFilter, statusFilter]) // Reload when filters change

  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleApproveClick = (user) => {
    setSelectedUser(user)
    setApproveDialogOpen(true)
  }

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setEditFormData({
      email: user.email,
      role: user.role,
    })
    setEditDialogOpen(true)
  }

  const handleDisableClick = (user) => {
    setSelectedUser(user)
    setDisableDialogOpen(true)
  }

  // Add enable click handler
  const handleEnableClick = (user) => {
    setSelectedUser(user)
    setEnableDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true)
      await deleteUser(selectedUser.id)
      setDeleteDialogOpen(false)
      setSnackbar({
        open: true,
        message: `User ${selectedUser.username} has been deleted`,
        severity: 'success',
      })
      loadUsers()
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to delete user: ${err.message}`,
        severity: 'error',
      })
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  const handleApproveConfirm = async () => {
    try {
      setActionLoading(true)
      await approveInstructor(selectedUser.id)
      setApproveDialogOpen(false)
      setSnackbar({
        open: true,
        message: `Instructor ${selectedUser.username} has been approved`,
        severity: 'success',
      })
      loadUsers()
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to approve instructor: ${err.message}`,
        severity: 'error',
      })
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  const handleEditSubmit = async () => {
    try {
      setActionLoading(true)
      await updateUser(selectedUser.id, editFormData)
      setEditDialogOpen(false)
      setSnackbar({
        open: true,
        message: `User ${selectedUser.username} has been updated`,
        severity: 'success',
      })
      loadUsers()
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to update user: ${err.message}`,
        severity: 'error',
      })
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  const handleDisableConfirm = async () => {
    try {
      setActionLoading(true)
      await disableUser(selectedUser.id)
      setDisableDialogOpen(false)
      setSnackbar({
        open: true,
        message: `User ${selectedUser.username} has been disabled`,
        severity: 'success',
      })
      loadUsers()
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to disable user: ${err.message}`,
        severity: 'error',
      })
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  // Add enable confirm handler
  const handleEnableConfirm = async () => {
    try {
      setActionLoading(true)
      await enableUser(selectedUser.id)
      setEnableDialogOpen(false)
      setSnackbar({
        open: true,
        message: `User ${selectedUser.username} has been enabled`,
        severity: 'success',
      })
      loadUsers()
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to enable user: ${err.message}`,
        severity: 'error',
      })
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false)
    setApproveDialogOpen(false)
    setEditDialogOpen(false)
    setDisableDialogOpen(false)
    setEnableDialogOpen(false) // Add enable dialog
    setSelectedUser(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Handle filter changes
  const handleUserTypeFilterChange = (event) => {
    setUserTypeFilter(event.target.value)
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    )
  }

  // Render error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <>
      {/* Add filter controls */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} /> Filter Users
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="user-type-filter-label">User Type</InputLabel>
            <Select
              labelId="user-type-filter-label"
              id="user-type-filter"
              value={userTypeFilter}
              label="User Type"
              onChange={handleUserTypeFilterChange}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="student">Students Only</MenuItem>
              <MenuItem value="instructor">Instructors Only</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending Approval</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found with the selected filters
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" color="action" />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={
                        user.role === 'admin'
                          ? 'secondary'
                          : user.role === 'instructor'
                            ? 'primary'
                            : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {user.role === 'instructor' && !user.is_active ? (
                      <Chip label="Pending Approval" size="small" color="warning" />
                    ) : user.is_active ? (
                      <Chip label="Active" size="small" color="success" />
                    ) : (
                      <Chip label="Inactive" size="small" color="error" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {user.role === 'instructor' && !user.is_active && (
                      <Button
                        startIcon={<ApproveIcon />}
                        color="success"
                        size="small"
                        onClick={() => handleApproveClick(user)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                    )}
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEditClick(user)}
                      sx={{ mr: 1 }}
                      disabled={user.role === 'admin'}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    {/* Show Enable button for inactive users */}
                    {!user.is_active && user.role !== 'admin' && user.role !== 'instructor' && (
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleEnableClick(user)}
                        sx={{ mr: 1 }}
                      >
                        <EnableIcon fontSize="small" />
                      </IconButton>
                    )}

                    {/* Show Disable button for active users */}
                    {user.is_active && user.role !== 'admin' && (
                      <IconButton
                        color="warning"
                        size="small"
                        onClick={() => handleDisableClick(user)}
                        sx={{ mr: 1 }}
                      >
                        <DisableIcon fontSize="small" />
                      </IconButton>
                    )}

                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(user)}
                      disabled={user.role === 'admin'}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.username}"? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve confirmation dialog */}
      <Dialog open={approveDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Approve Instructor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve "{selectedUser?.username}" as an instructor? They will
            receive an email notification and will be able to create content.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleApproveConfirm}
            color="success"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit user dialog - updated to email and role only */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update information for user {selectedUser?.username}.
          </DialogContentText>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={editFormData.email}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={editFormData.role}
                label="Role"
                onChange={handleInputChange}
                disabled={selectedUser?.role === 'admin'}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="instructor">Instructor</MenuItem>
                {selectedUser?.role === 'admin' && <MenuItem value="admin">Admin</MenuItem>}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disable user confirmation dialog */}
      <Dialog open={disableDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Disable User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to disable the user "{selectedUser?.username}"? They will no
            longer be able to access the system, but their data will be preserved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDisableConfirm}
            color="warning"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Disabling...' : 'Disable User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enable user confirmation dialog */}
      <Dialog open={enableDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Enable User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to enable the user "{selectedUser?.username}"? They will be able
            to access the system again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEnableConfirm}
            color="success"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            {actionLoading ? 'Enabling...' : 'Enable User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UserList
