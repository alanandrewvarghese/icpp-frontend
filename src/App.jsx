import React, { useState, useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'

import LoginPage from './pages/Accounts/LoginPage'
import RegisterStudentPage from './pages/Accounts/RegisterStudentPage'
import RegisterInstructorPage from './pages/Accounts/RegisterInstructorPage'
import LogoutPage from './pages/Accounts/LogoutPage'
import PasswordChangePage from './pages/Accounts/PasswordChangePage'
import ForgotPasswordPage from './pages/Accounts/ForgotPasswordPage'
import ResetPasswordConfirmPage from './pages/Accounts/ResetPasswordConfirmPage'

import LessonListPage from './pages/Lessons/LessonListPage'
import LessonDetailPage from './pages/Lessons/LessonDetailPage'
import CreateLessonPage from './pages/Lessons/CreateLessonPage'
import ExercisePage from './pages/Exercises/ExercisePage'
import CreateExercisePage from './pages/Exercises/CreateExercisePage'
import EditExercisePage from './pages/Exercises/EditExercisePage'
import AllExercisesPage from './pages/Exercises/AllExercisesPage'

// Import Quiz pages
import ManageQuizzesPage from './pages/Quizzes/ManageQuizzesPage'
import CreateQuizPage from './pages/Quizzes/CreateQuizPage'
import EditQuizPage from './pages/Quizzes/EditQuizPage'
import TakeQuizPage from './pages/Quizzes/TakeQuizPage'
import QuizStatisticsPage from './pages/Quizzes/QuizStatisticsPage'

import UserManagementPage from './pages/Admin/UserManagementPage'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'

import BadgesPage from './pages/Progress/BadgePage'
import AnalyticsPage from './pages/Admin/AnalyticsPage'

import MyTicketsPage from './pages/Tickets/user/MyTicketsPage'
import CreateTicketPage from './pages/Tickets/user/CreateTicketPage'
import TicketDetailPage from './pages/Tickets/user/TicketDetailPage'
import AdminTicketsPage from './pages/Tickets/admin/AdminTicketsPage'
import AdminTicketDetailPage from './pages/Tickets/admin/AdminTicketDetailPage'

function App() {
  const [navLinks, setNavLinks] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const isAuthenticated = user?.role && user.role !== 'guest'
    const hasRole = (roles = []) => roles.length === 0 || (user?.role && roles.includes(user.role))

    const commonLinks = []

    const studentLinks =
      isAuthenticated && hasRole(['student'])
        ? [
            { text: 'Lessons', url: '/lessons' },
            { text: 'Badges', url: '/badges' },
            { text: 'Support', url: '/support/tickets' },
            // Other student-specific links
          ]
        : []

    const instructorLinks =
      isAuthenticated && hasRole(['instructor'])
        ? [
            { text: 'Create Lesson', url: '/lessons/create' },
            { text: 'Create Exercise', url: '/exercises/create' },
            { text: 'Manage Quizzes', url: '/quizzes/manage' },
            { text: 'Lessons', url: '/lessons' },
            { text: 'Support', url: '/support/tickets' },
            // Other instructor-specific links
          ]
        : []

    const adminLinks =
      isAuthenticated && hasRole(['admin'])
        ? [
            { text: 'Dashboard', url: '/admin/dashboard' },
            { text: 'Analytics', url: '/admin/analytics' },
            { text: 'Manage User', url: '/admin/users' },
            { text: 'Manage Quizzes', url: '/quizzes/manage' },
            { text: 'Support Tickets', url: '/admin/support/tickets' },
            // Admin-specific links
          ]
        : []

    const roleSpecificLinks = [...studentLinks, ...instructorLinks, ...adminLinks]

    const authLinks = isAuthenticated
      ? [
          {
            text: 'Account',
            subLinks: [
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

    setNavLinks([...commonLinks, ...roleSpecificLinks, ...authLinks])
  }, [user])

  return (
    <>
      <Header navLinks={navLinks} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/student" element={<RegisterStudentPage />} />
        <Route path="/register/instructor" element={<RegisterInstructorPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirmPage />} />

        {/* Protected routes - require authentication */}
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <LogoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/change"
          element={
            <ProtectedRoute>
              <PasswordChangePage />
            </ProtectedRoute>
          }
        />

        {/* Student & instructor routes */}
        <Route
          path="/lessons"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <LessonListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:lessonId"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <LessonDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/:exerciseId"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <ExercisePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AllExercisesPage />
            </ProtectedRoute>
          }
        />

        {/* Quiz routes */}
        <Route
          path="/quizzes/take/:quizId"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
              <TakeQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/manage"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <ManageQuizzesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/create"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/edit/:quizId"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <EditQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/stats/:quizId"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <QuizStatisticsPage />
            </ProtectedRoute>
          }
        />

        {/* Instructor/admin only routes */}
        <Route
          path="/lessons/create"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <CreateLessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/edit/:lessonId"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <CreateLessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/create"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <CreateExercisePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercises/edit/:exerciseId"
          element={
            <ProtectedRoute allowedRoles={['instructor', 'admin']}>
              <EditExercisePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <BadgesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Support Ticket Routes */}
        <Route
          path="/support/tickets"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor']}>
              <MyTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support/new-ticket"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor']}>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support/tickets/:ticketId"
          element={
            <ProtectedRoute allowedRoles={['student', 'instructor']}>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Support Ticket Routes */}
        <Route
          path="/admin/support/tickets"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/support/tickets/:ticketId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTicketDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
