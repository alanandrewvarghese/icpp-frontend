import React, { createContext, useContext, useReducer } from 'react'

// Initial state for the quiz context
const initialState = {
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,
  userRole: null,
}

// Actions
export const QUIZ_ACTIONS = {
  SET_QUIZZES: 'SET_QUIZZES',
  SET_CURRENT_QUIZ: 'SET_CURRENT_QUIZ',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER_ROLE: 'SET_USER_ROLE',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Reducer for quiz state management
function quizReducer(state, action) {
  switch (action.type) {
    case QUIZ_ACTIONS.SET_QUIZZES:
      return { ...state, quizzes: action.payload, loading: false }
    case QUIZ_ACTIONS.SET_CURRENT_QUIZ:
      return { ...state, currentQuiz: action.payload, loading: false }
    case QUIZ_ACTIONS.SET_LOADING:
      return { ...state, loading: true }
    case QUIZ_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    case QUIZ_ACTIONS.SET_USER_ROLE:
      return { ...state, userRole: action.payload }
    case QUIZ_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}

// Create context
const QuizContext = createContext()

// Context provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  return <QuizContext.Provider value={{ state, dispatch }}>{children}</QuizContext.Provider>
}

// Custom hook to use quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
