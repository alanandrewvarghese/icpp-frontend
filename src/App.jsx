// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom' // Import Routes and Route
import LoginPage from './pages/Accounts/LoginPage' // Assuming you will create these pages
import RegisterStudentPage from './pages/Accounts/RegisterStudentPage'
import RegisterInstructorPage from './pages/Accounts/RegisterInstructorPage'
import HomePage from './pages/HomePage' // Assuming you have a HomePage
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

function App() {
  const navLinks = [
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

  return (
    <>
      <Header navLinks={navLinks} />
      <Routes>
        {' '}
        {/* Define routes */}
        <Route path="/" element={<HomePage />} /> {/* Home page route */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page route */}
        <Route path="/register/student" element={<RegisterStudentPage />} />{' '}
        {/* Student registration route */}
        <Route path="/register/instructor" element={<RegisterInstructorPage />} />{' '}
        {/* Instructor registration route */}
      </Routes>
      <Footer />
    </>
  )
}

export default App
