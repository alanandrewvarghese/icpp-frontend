import { createContext } from 'react'

// Create and export the context object with default values for all functions
export const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: false,
  loginContext: () => {},
  logoutContext: () => {},
  registerStudentContext: () => {},
  registerInstructorContext: () => {},
  approveInstructorContext: () => {},
})
