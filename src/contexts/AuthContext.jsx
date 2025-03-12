import { createContext, useState } from 'react'
import { login, registerStudent, registerInstructor, logout } from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const loginContext = async (username, password) => {
    const response = await login(username, password)
    if (response.token) {
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('token', response.token)
    }
    return response
  }

  const registerStudentContext = async (username, password, email) => {
    const response = await registerStudent(username, password, email)
    return response
  }

  const registerInstructorContext = async (username, password, email) => {
    const response = await registerInstructor(username, password, email)
    return response
  }

  const logoutContext = async () => {
    const response = await logout()
    if (response.success) {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
    }
    return response
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginContext,
        registerStudentContext,
        registerInstructorContext,
        logoutContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
