import './App.css'
// Import Pages
import Dashboard1 from './admin_pages/Dashboard'
import Dashboard2 from './user_pages/Dashboard'
import TeacherDashboard from './teacher_pages/Dashboard'
import QuizPerformance from './teacher_pages/QuizPerformance'
import SummerizerCard from './user_pages/SummerizerCard'
import Login from './authentication_pages/Login'
import Register from './authentication_pages/Register'
import VerifyEmail from './authentication_pages/VerifyEmail'
import Quiz from './user_pages/Quiz'
import TakeQuiz from './user_pages/TakeQuiz'
import Quizzes from './user_pages/Quizzes'
import AITools from './user_pages/AITools'
import AIStudyBuddy from './user_pages/AIStudyBuddy'
import Notes from './user_pages/Notes'
import TeacherAITools from './teacher_pages/AITools'
import ProtectedRoute from './components/ProtectedRoute'
import { Navigate, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes - Accessible by anyone */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes - Only accessible by authenticated users */}
        {/* The 'ProtectedRoute' component checks if the user is logged in */}

        {/* Student Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard2 />
          </ProtectedRoute>
        } />
        <Route path="/summerize" element={
          <ProtectedRoute>
            <SummerizerCard />
          </ProtectedRoute>
        } />
        <Route path="/notesquiz" element={
          <ProtectedRoute>
            {/* This seems to be for creating/viewing a quiz from notes */}
            <Quiz />
          </ProtectedRoute>
        } />
        <Route path="/quizzes" element={
          <ProtectedRoute>
            <Quizzes />
          </ProtectedRoute>
        } />
        <Route path="/quiz/:quizId" element={
          <ProtectedRoute>
            <TakeQuiz />
          </ProtectedRoute>
        } />
        <Route path="/ai-tools" element={
          <ProtectedRoute>
            <AITools />
          </ProtectedRoute>
        } />
        <Route path="/ai-buddy" element={
          <ProtectedRoute>
            <AIStudyBuddy />
          </ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } />

        {/* Admin Routes - Only for users with 'admin' role */}
        <Route path="/admin_dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard1 />
          </ProtectedRoute>
        } />

        {/* Teacher Routes - Only for users with 'teacher' role */}
        <Route path="/teacher_dashboard" element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher-ai-tools" element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherAITools />
          </ProtectedRoute>
        } />
        <Route path="/quiz-performance/:quizId" element={
          <ProtectedRoute requiredRole="teacher">
            <QuizPerformance />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
