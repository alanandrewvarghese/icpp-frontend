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
import PasswordChangePage from './pages/Accounts/PasswordChangePage'
import ForgotPasswordPage from './pages/Accounts/ForgotPasswordPage'
import ResetPasswordConfirmPage from './pages/Accounts/ResetPasswordConfirmPage'

function App() {
  const [navLinks, setNavLinks] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const role = user?.role || 'guest'
    const isLoggedIn = role !== 'guest'

    // Common links for all users
    const commonLinks = []

    // Main navigation links based on role
    const roleSpecificLinks = [
      ...(role === 'student'
        ? [
            { text: 'Sample Link', url: '/' },
            { text: 'Sample Link', url: '/' },
          ]
        : []),

      ...(role === 'instructor'
        ? [
            { text: 'Sample Link', url: '/' },
            { text: 'Sample Link', url: '/' },
            { text: 'Sample Link', url: '/' },
          ]
        : []),

      ...(role === 'admin'
        ? [
            { text: 'Sample Link', url: '/' },
            { text: 'Sample Link', url: '/' },
            { text: 'Sample Link', url: '/' },
          ]
        : []),
    ]

    // // Resources dropdown for all users
    // const resourcesDropdown = {
    //   text: 'Resources',
    //   subLinks: [
    //     { text: 'Documentation', url: '/resources/docs' },
    //     { text: 'Tutorials', url: '/resources/tutorials' },
    //     { text: 'FAQ', url: '/resources/faq' },
    //   ],
    // }

    // Authentication links
    const authLinks = isLoggedIn
      ? [
          {
            text: 'Account',
            subLinks: [
              { text: 'Sample Sub Link', url: `/` },
              { text: 'Sample Sub Link', url: '/' },
              { text: 'Change Password', url: '/password/change' },
              { text: 'Logout', url: '/logout' },
            ],
          },
        ]
      : [
          { text: 'Login', url: '/login' },
          {
            text: 'Register',
            subLinks: [
              { text: 'Student', url: '/register/student' },
              { text: 'Instructor', url: '/register/instructor' },
            ],
          },
        ]

    // Combine all links, Add if needed: resourcesDropdown,
    setNavLinks([...commonLinks, ...roleSpecificLinks, ...authLinks])
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
        <Route path="/password/change" element={<PasswordChangePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirmPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
