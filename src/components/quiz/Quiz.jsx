import React from 'react'
import { QuizProvider } from './context/QuizContext'
import QuizList from './shared/QuizList'
import QuizDetail from './shared/QuizDetail'
import QuizForm from './instructor/QuizForm'
import QuizTaking from './student/QuizTaking'
import QuizStatistics from './instructor/QuizStatistics'

// This component will handle conditional rendering based on the current state/route
const Quiz = ({ mode, id, userRole, lessonId, onSave }) => {
  let content

  switch (mode) {
    case 'list':
      content = <QuizList />
      break
    case 'detail':
      content = <QuizDetail quizId={id} />
      break
    case 'create':
      content = <QuizForm lessonId={lessonId} onSave={onSave} />
      break
    case 'edit':
      content = <QuizForm quizId={id} onSave={onSave} />
      break
    case 'take':
      content = <QuizTaking quizId={id} />
      break
    case 'stats':
      content = <QuizStatistics quizId={id} />
      break
    default:
      content = <div>Invalid quiz mode</div>
  }

  return (
    <QuizProvider>
      <div className="quiz-container">{content}</div>
    </QuizProvider>
  )
}

export default Quiz
