import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const LogoutPage = () => {
  const { logoutContext } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogout = async () => {
      await logoutContext()
      navigate('/login')
    }

    handleLogout()
  }, [logoutContext, navigate])

  return <div>Logging out...</div>
}

export default LogoutPage
