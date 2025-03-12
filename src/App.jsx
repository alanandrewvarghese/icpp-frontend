import React, { useState, useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Accounts/LoginPage'
import RegisterStudentPage from './pages/Accounts/RegisterStudentPage'
import RegisterInstructorPage from './pages/Accounts/RegisterInstructorPage'
import HomePage from './pages/HomePage'
import LogoutPage from './pages/Accounts/LogoutPage'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { AuthContext } from './contexts/AuthContext'

function App() {
  const [navLinks, setNavLinks] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const role = user?.role || 'guest'

    const links = [
      ...(role === 'guest'
        ? [
            { text: 'Home', url: '/' },
            { text: 'Login', url: '/login' },
            {
              text: 'Register',
              subLinks: [
                { text: 'Student', url: '/register/student' },
                { text: 'Instructor', url: '/register/instructor' },
              ],
            },
          ]
        : []),
      ...(role === 'student'
        ? [
            { text: 'Dashboard', url: '/student-dashboard' },
            { text: 'Logout', url: '/logout' },
          ]
        : []),
      ...(role === 'instructor'
        ? [
            { text: 'Instructor Panel', url: '/instructor-dashboard' },
            { text: 'Logout', url: '/logout' },
          ]
        : []),
      ...(role === 'admin'
        ? [
            { text: 'Admin Panel', url: '/admin-dashboard' },
            { text: 'Logout', url: '/logout' },
          ]
        : []),
    ]

    setNavLinks(links)
  }, [user])
  return (
    <>
      <Header navLinks={navLinks} />
      <Routes>
        {' '}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/student" element={<RegisterStudentPage />} />{' '}
        <Route path="/register/instructor" element={<RegisterInstructorPage />} />{' '}
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
