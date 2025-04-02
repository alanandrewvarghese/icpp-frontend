import apiClient from './apiClient'

/**
 * Fetch all users
 * @returns {Promise} - Promise with the users data
 */
const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/accounts/admin/users/')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

/**
 * Fetch only instructors
 * @returns {Promise} - Promise with the instructors data
 */
const fetchInstructors = async () => {
  try {
    const response = await apiClient.get('/accounts/admin/users/instructors/')
    return response.data
  } catch (error) {
    console.error('Error fetching instructors:', error)
    throw error
  }
}

/**
 * Fetch only students
 * @returns {Promise} - Promise with the students data
 */
const fetchStudents = async () => {
  try {
    const response = await apiClient.get('/accounts/admin/users/students/')
    return response.data
  } catch (error) {
    console.error('Error fetching students:', error)
    throw error
  }
}

/**
 * Fetch a specific user by ID
 * @param {string|number} userId - The ID of the user to fetch
 * @returns {Promise} - Promise with the user data
 */
const fetchUser = async (userId) => {
  try {
    const response = await apiClient.get(`/accounts/admin/users/${userId}/detail/`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error)
    throw error
  }
}

/**
 * Update user details
 * @param {string|number} userId - The ID of the user to update
 * @param {Object} userData - The updated user data
 * @returns {Promise} - Promise with the updated user data
 */
const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/accounts/admin/users/${userId}/update/`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error)
    throw error
  }
}

/**
 * Approve instructor registration
 * @param {string|number} userId - The ID of the instructor to approve
 * @returns {Promise} - Promise with the approval result
 */
const approveInstructor = async (userId) => {
  try {
    const response = await apiClient.put(`/accounts/admin/instructors/${userId}/approve/`)
    return response.data
  } catch (error) {
    console.error(`Error approving instructor with ID ${userId}:`, error)
    throw error
  }
}

/**
 * Delete a user
 * @param {string|number} userId - The ID of the user to delete
 * @returns {Promise} - Promise with the deletion result
 */
const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/accounts/admin/users/${userId}/delete/`)
    return response.data
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error)
    throw error
  }
}

/**
 * Disable a user account
 * @param {string|number} userId - The ID of the user to disable
 * @returns {Promise} - Promise with the updated user data
 */
const disableUser = async (userId) => {
  try {
    const response = await updateUser(userId, { is_active: false })
    return response.data
  } catch (error) {
    console.error(`Error disabling user with ID ${userId}:`, error)
    throw error
  }
}

/**
 * Enable a user account
 * @param {string|number} userId - The ID of the user to enable
 * @returns {Promise} - Promise with the updated user data
 */
const enableUser = async (userId) => {
  try {
    const response = await updateUser(userId, { is_active: true })
    return response.data
  } catch (error) {
    console.error(`Error enabling user with ID ${userId}:`, error)
    throw error
  }
}

export {
  fetchUsers,
  fetchUser,
  fetchInstructors,
  fetchStudents,
  updateUser,
  approveInstructor,
  deleteUser,
  disableUser,
  enableUser,
}
